import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Code,
  Hand,
  Mic,
  MicOff,
  MessageSquare,
  PhoneOff,
  Send,
  Share,
  Users,
  Video,
  VideoOff,
} from 'lucide-react'
import { useSocket } from '../hooks/useSocket'
import { useClassroomMedia } from '../hooks/useClassroomMedia'
import { classroomAPI, coursesAPI } from '../services/api'
import { updateWhiteboard } from '../store/slices/classroomSlice'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const tabs = [
  { id: 'meeting', label: 'Meeting', icon: Video },
  { id: 'lesson', label: 'Lesson', icon: BookOpen },
  { id: 'whiteboard', label: 'Shared notes', icon: Share },
  { id: 'code', label: 'Code', icon: Code },
]

const getYouTubeEmbedUrl = url => {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`
    if (parsed.hostname === 'youtube.com' || parsed.hostname.endsWith('.youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).at(-1)
      return id && /^[\w-]{6,20}$/.test(id)
        ? `https://www.youtube-nocookie.com/embed/${id}`
        : null
    }
  } catch {
    return null
  }
  return null
}

function Classroom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.currentUser)
  const { messages, participants, isHandRaised, whiteboardState, roomEnded } = useSelector(
    state => state.classroom
  )
  const [messageInput, setMessageInput] = useState('')
  const [activeTab, setActiveTab] = useState('meeting')
  const [code, setCode] = useState('')
  const { data: session, isLoading, error } = useQuery({
    queryKey: ['classroom-session', id],
    queryFn: async () => {
      const response = await classroomAPI.joinById(id)
      return response.data.data
    },
    retry: false,
  })

  const { isConnected, sendMessage, toggleHand, sendWhiteboardUpdate, announceRoomEnded, socket } = useSocket(session?.id)
  const { localStream, remoteStreams, cameraOn, micOn, mediaError, toggleCamera, toggleMic } = useClassroomMedia({
    socket,
    roomId: session?.id,
    participants,
    currentUserId: currentUser?._id || currentUser?.id,
    isConnected,
  })

  const endClassroom = useMutation({
    mutationFn: async () => {
      const response = await classroomAPI.endSession(id)
      await new Promise(resolve => announceRoomEnded(resolve))
      return response
    },
    onSuccess: () => navigate('/classrooms'),
  })

  useEffect(() => {
    if (roomEnded) navigate('/classrooms', { replace: true })
  }, [roomEnded, navigate])

  const { data: course } = useQuery({
    queryKey: ['classroom-course', session?.courseId],
    queryFn: async () => {
      const response = await coursesAPI.getById(session.courseId)
      return response.data.data
    },
    enabled: Boolean(session?.courseId),
    retry: false,
  })

  const { module, lesson } = useMemo(() => {
    const modules = course?.modules || []
    for (const courseModule of modules) {
      const foundLesson = courseModule.lessons?.find(
        item => String(item._id) === String(session?.lessonId)
      )
      if (foundLesson) return { module: courseModule, lesson: foundLesson }
    }
    return { module: null, lesson: null }
  }, [course, session?.lessonId])

  const handleSendMessage = event => {
    event.preventDefault()
    const content = messageInput.trim()
    if (!content || !isConnected) return
    sendMessage(content)
    setMessageInput('')
  }

  const handleWhiteboardChange = event => {
    const value = event.target.value
    dispatch(updateWhiteboard(value))
    sendWhiteboardUpdate(value)
  }

  if (isLoading) return <LoadingSpinner />

  if (error || !session) {
    const message = error?.response?.data?.message || 'This classroom is unavailable.'
    return (
      <div className="container-custom flex min-h-[60vh] items-center justify-center py-12">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-amber-600" size={36} />
          <h1 className="mb-2 text-2xl font-bold text-text-primary">Unable to join classroom</h1>
          <p className="mb-6 text-text-secondary">{message}</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back to learning
          </Link>
        </div>
      </div>
    )
  }

  const title = lesson?.title || session.title || 'Live classroom'
  const currentUserId = currentUser?._id || currentUser?.id
  const isHost = String(session.host) === String(currentUserId)
  const videoUrl = lesson?.content?.videoUrl
  const embedUrl = getYouTubeEmbedUrl(videoUrl)
  const roomCode = session.code

  return (
    <section className="container-custom py-5">
      <div className="flex min-h-[min(78vh,820px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-slate-950 px-5 py-4 text-white">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
              {roomCode ? `Classroom ${roomCode}` : 'Live classroom'}
            </p>
            <h1 className="truncate text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isConnected ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-200'
              }`}
              aria-live="polite"
            >
              {isConnected ? 'Connected' : 'Reconnecting'}
            </span>
            <span className="flex items-center gap-2 text-sm text-slate-200">
              <Users size={16} /> {participants.length} / {session.settings?.maxParticipants || 100}
            </span>
            {isHost ? (
              <button
                type="button"
                onClick={() => endClassroom.mutate()}
                disabled={endClassroom.isPending}
                className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium hover:bg-white/10 disabled:opacity-50"
              >
                {endClassroom.isPending ? 'Ending…' : 'End classroom'}
              </button>
            ) : (
              <Link
                to="/classrooms"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium hover:bg-white/10"
              >
                <ArrowLeft size={16} /> Leave
              </Link>
            )}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <main className="flex min-h-[440px] min-w-0 flex-1 flex-col">
            <nav className="flex border-b border-gray-200 px-3" aria-label="Classroom tools">
              {tabs.map(({ id: tabId, label, icon: Icon }) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setActiveTab(tabId)}
                  aria-current={activeTab === tabId ? 'page' : undefined}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tabId
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </nav>

            {activeTab === 'lesson' && (
              <div className="flex-1 overflow-y-auto p-5 md:p-7">
                <div className="mx-auto max-w-4xl">
                  {embedUrl ? (
                    <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-slate-950">
                      <iframe
                        src={embedUrl}
                        title={title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : videoUrl ? (
                    <video src={videoUrl} controls className="mb-6 aspect-video w-full rounded-xl bg-slate-950">
                      Your browser does not support embedded video.
                    </video>
                  ) : null}
                  <div className="rounded-xl border border-gray-200 p-5 md:p-7">
                    {module?.title && <p className="mb-2 text-sm font-medium text-primary">{module.title}</p>}
                    <h2 className="mb-3 text-xl font-bold text-text-primary">{title}</h2>
                    <p className="whitespace-pre-wrap leading-7 text-text-secondary">
                      {lesson?.content?.text || lesson?.description || session.title
                        ? lesson?.content?.text || lesson?.description || 'The instructor has not added lesson notes yet.'
                        : 'This room is ready. Shared notes and chat are available while the instructor prepares the lesson.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'meeting' && (
              <div className="flex flex-1 flex-col bg-slate-950 p-4 md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3 text-white">
                  <div>
                    <h2 className="font-semibold">Live classroom</h2>
                    <p className="text-xs text-slate-400">Turn on your camera or microphone when you are ready.</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{participants.length} here</span>
                </div>
                <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="relative min-h-52 overflow-hidden rounded-xl border border-white/10 bg-slate-800">
                    {cameraOn && localStream ? (
                      <video
                        autoPlay
                        playsInline
                        muted
                        ref={element => {
                          if (element && element.srcObject !== localStream) element.srcObject = localStream
                        }}
                        className="h-full min-h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 text-slate-300">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                          {currentUser?.name?.charAt(0)?.toUpperCase() || 'Y'}
                        </div>
                        <span className="text-sm">Camera is off</span>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                      {currentUser?.name || 'You'} (you)
                    </span>
                  </div>
                  {participants
                    .filter(person => String(person.id) !== String(currentUserId))
                    .map(person => {
                      const stream = remoteStreams[person.id]
                      return (
                        <div key={person.id} className="relative min-h-52 overflow-hidden rounded-xl border border-white/10 bg-slate-800">
                          {stream ? (
                            <video
                              autoPlay
                              playsInline
                              ref={element => {
                                if (element && element.srcObject !== stream) element.srcObject = stream
                              }}
                              className="h-full min-h-52 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 text-slate-300">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 text-xl font-bold text-white">
                                {person.name?.charAt(0)?.toUpperCase() || 'S'}
                              </div>
                              <span className="text-sm">Camera is off</span>
                            </div>
                          )}
                          <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                            {person.name || 'Participant'}
                          </span>
                        </div>
                      )
                    })}
                </div>
                {mediaError && (
                  <p role="status" className="mt-3 rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
                    {mediaError}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => void toggleMic()}
                    aria-pressed={micOn}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${micOn ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                  >
                    {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                    {micOn ? 'Mute mic' : 'Turn on mic'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleCamera()}
                    aria-pressed={cameraOn}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${cameraOn ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                  >
                    {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                    {cameraOn ? 'Stop video' : 'Start video'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHand(!isHandRaised)}
                    disabled={!isConnected}
                    aria-pressed={isHandRaised}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${isHandRaised ? 'bg-amber-300 text-amber-950' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                  >
                    <Hand size={18} /> {isHandRaised ? 'Lower hand' : 'Raise hand'}
                  </button>
                  <Link to="/classrooms" className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700">
                    <PhoneOff size={18} /> Leave meeting
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'whiteboard' && (
              <div className="flex flex-1 flex-col p-5 md:p-7">
                <div className="mb-3">
                  <h2 className="font-semibold text-text-primary">Shared lesson notes</h2>
                  <p className="text-sm text-text-secondary">
                    Changes are shared with everyone in this room as you type.
                  </p>
                </div>
                <textarea
                  value={whiteboardState || ''}
                  onChange={handleWhiteboardChange}
                  maxLength={10000}
                  disabled={!isConnected}
                  aria-label="Shared classroom notes"
                  placeholder="Write key ideas, questions, and examples here…"
                  className="min-h-72 flex-1 resize-y rounded-xl border border-gray-200 p-4 leading-7 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50"
                />
                <p className="mt-2 text-right text-xs text-text-muted">
                  {(whiteboardState || '').length.toLocaleString()} / 10,000 characters
                </p>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="flex flex-1 flex-col p-5 md:p-7">
                <label htmlFor="classroom-code" className="mb-3 font-semibold text-text-primary">
                  Personal code scratchpad
                </label>
                <textarea
                  id="classroom-code"
                  value={code}
                  onChange={event => setCode(event.target.value)}
                  spellCheck="false"
                  placeholder={'# Draft an example here\n'}
                  className="min-h-72 flex-1 resize-y rounded-xl bg-slate-950 p-5 font-mono text-sm leading-6 text-emerald-200 outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="mt-2 text-sm text-text-secondary">
                  This scratchpad is private. Paste a snippet into room chat to share it.
                </p>
              </div>
            )}

            <footer className="flex items-center justify-between gap-4 border-t border-gray-200 px-5 py-3">
              <span className="text-sm text-text-secondary">
                {participants.map(person => person.name).filter(Boolean).join(', ') || 'Waiting for participants'}
              </span>
              <button
                type="button"
                onClick={() => toggleHand(!isHandRaised)}
                disabled={!isConnected}
                aria-pressed={isHandRaised}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isHandRaised
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Hand size={17} /> {isHandRaised ? 'Lower hand' : 'Raise hand'}
              </button>
            </footer>
          </main>

          <aside className="flex max-h-[520px] min-h-72 flex-col border-t border-gray-200 lg:max-h-none lg:w-80 lg:border-l lg:border-t-0 xl:w-96">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-4">
              <MessageSquare size={18} className="text-primary" />
              <h2 className="font-semibold text-text-primary">Room chat</h2>
              <span className="ml-auto text-xs text-text-muted">{messages.length} messages</span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
              {messages.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-text-secondary">
                  No messages yet. Say hello to start the discussion.
                </p>
              ) : (
                messages.map(message => {
                  const isOwnMessage = message.sender?.id === (currentUser?._id || currentUser?.id)
                  return (
                    <article key={message.id} className={`max-w-[92%] ${isOwnMessage ? 'ml-auto' : ''}`}>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-primary">
                          {isOwnMessage ? 'You' : message.sender?.name || 'Participant'}
                        </span>
                        <time className="text-[11px] text-text-muted">
                          {message.timestamp && Number.isFinite(new Date(message.timestamp).getTime())
                            ? new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                            : ''}
                        </time>
                      </div>
                      <p className="whitespace-pre-wrap break-words rounded-xl bg-slate-100 px-3 py-2 text-sm text-text-primary">
                        {message.content}
                      </p>
                    </article>
                  )
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3">
              <div className="flex gap-2">
                <input
                  value={messageInput}
                  onChange={event => setMessageInput(event.target.value)}
                  maxLength={2000}
                  disabled={!isConnected}
                  aria-label="Message to the classroom"
                  placeholder={isConnected ? 'Write a message…' : 'Reconnecting…'}
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!isConnected || !messageInput.trim()}
                  className="rounded-lg bg-primary px-3 text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={17} />
                </button>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Classroom
