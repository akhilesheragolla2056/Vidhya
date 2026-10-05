import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowRight, Clock3, DoorOpen, Plus, Radio, Users } from 'lucide-react'
import { classroomAPI } from '../services/api'

const getErrorMessage = error => error?.response?.data?.message || 'Please try again in a moment.'

export default function Classrooms() {
  const navigate = useNavigate()
  const currentUser = useSelector(state => state.user.currentUser)
  const canTeach = ['teacher', 'admin'].includes(currentUser?.role)
  const [title, setTitle] = useState('Science lesson')
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { data: classrooms = [], isLoading: roomsLoading, isError: roomsError } = useQuery({
    queryKey: ['classrooms-mine', currentUser?._id || currentUser?.id],
    queryFn: async () => (await classroomAPI.getMine()).data?.data || [],
    enabled: Boolean(currentUser),
  })

  const createClassroom = useMutation({
    mutationFn: () => classroomAPI.create({ title: title.trim() }),
    onSuccess: response => navigate(response.data.data.joinUrl),
    onError: error => setErrorMessage(getErrorMessage(error)),
  })

  const joinClassroom = useMutation({
    mutationFn: () => classroomAPI.join(code.trim().toUpperCase()),
    onSuccess: response => navigate(`/classroom/${response.data.data.roomId}`),
    onError: error => setErrorMessage(getErrorMessage(error)),
  })

  const isPending = createClassroom.isPending || joinClassroom.isPending

  return (
    <main className="container-custom py-10 md:py-16">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Users size={27} />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Live learning</p>
        <h1 className="mb-3 text-3xl font-bold text-text-primary md:text-4xl">Classrooms</h1>
        <p className="text-text-secondary">
          {canTeach
            ? 'Create a live lesson, share the invite code, and work together in real time.'
            : 'Join your teacher’s live lesson with an invite code and collaborate in real time.'}
        </p>
      </header>

      {errorMessage && (
        <p role="alert" className="mx-auto mb-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      )}

      <div className={`mx-auto grid max-w-5xl gap-6 ${canTeach ? 'md:grid-cols-2' : 'md:max-w-2xl'}`}>
        {canTeach && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus size={22} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-text-primary">Create a classroom</h2>
            <p className="mb-6 text-sm leading-6 text-text-secondary">
              Start a teacher-led lesson space with shared notes, live chat, attendance, and lesson videos.
            </p>
            <form
              onSubmit={event => {
                event.preventDefault()
                setErrorMessage('')
                createClassroom.mutate()
              }}
              className="space-y-4"
            >
              <label htmlFor="classroom-title" className="block text-sm font-medium text-text-primary">
                Classroom name
              </label>
              <input
                id="classroom-title"
                required
                maxLength={120}
                value={title}
                onChange={event => setTitle(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={isPending || !title.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createClassroom.isPending ? 'Creating…' : 'Create classroom'}
                <ArrowRight size={18} />
              </button>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <DoorOpen size={22} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-text-primary">Join a classroom</h2>
          <p className="mb-6 text-sm leading-6 text-text-secondary">
            Enter the six-character invite code shared by your teacher.
          </p>
          <form
            onSubmit={event => {
              event.preventDefault()
              setErrorMessage('')
              joinClassroom.mutate()
            }}
            className="space-y-4"
          >
            <label htmlFor="classroom-code" className="block text-sm font-medium text-text-primary">
              Invite code
            </label>
            <input
              id="classroom-code"
              required
              minLength={6}
              maxLength={6}
              value={code}
              onChange={event => setCode(event.target.value.replace(/[^a-z\d]/gi, '').slice(0, 6).toUpperCase())}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck="false"
              placeholder="ABC123"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-mono text-lg tracking-[0.35em] uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={isPending || code.length !== 6}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {joinClassroom.isPending ? 'Joining…' : 'Join classroom'}
              <ArrowRight size={18} />
            </button>
          </form>
        </section>
      </div>

      <section className="mx-auto mt-12 max-w-5xl" aria-labelledby="my-classrooms-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary">Your learning spaces</p>
            <h2 id="my-classrooms-title" className="text-2xl font-bold text-text-primary">My classrooms</h2>
          </div>
          {!roomsLoading && <span className="text-sm text-text-muted">{classrooms.length} rooms</span>}
        </div>
        {roomsError ? (
          <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Your classrooms could not be loaded. Refresh the page to try again.</p>
        ) : roomsLoading ? (
          <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-text-secondary">Loading your classrooms…</p>
        ) : classrooms.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classrooms.map(room => {
              const isHost = String(room.host) === String(currentUser?._id || currentUser?.id)
              return (
                <article key={room._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Users size={20} /></div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${room.status === 'active' ? 'bg-emerald-50 text-emerald-700' : room.status === 'ended' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-700'}`}>
                      {room.status === 'active' ? <Radio size={12} /> : <Clock3 size={12} />}
                      {room.status === 'active' ? 'Live' : room.status === 'ended' ? 'Ended' : 'Waiting'}
                    </span>
                  </div>
                  <h3 className="mb-1 truncate font-semibold text-text-primary">{room.title}</h3>
                  <p className="mb-4 text-sm text-text-secondary">Invite code <span className="font-mono font-semibold tracking-wider text-text-primary">{room.code}</span></p>
                  <button
                    type="button"
                    onClick={() => navigate(`/classroom/${room._id}`)}
                    disabled={room.status === 'ended'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white disabled:hover:text-gray-400"
                  >
                    {room.status === 'ended' ? 'Session ended' : isHost ? 'Open classroom' : 'Join classroom'}
                    {room.status !== 'ended' && <ArrowRight size={16} />}
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
            <Users size={28} className="mx-auto mb-3 text-gray-400" />
            <p className="font-semibold text-text-primary">No classrooms yet</p>
            <p className="mt-1 text-sm text-text-secondary">{canTeach ? 'Create a classroom to start your first live lesson.' : 'When you join a teacher’s classroom, it will appear here.'}</p>
          </div>
        )}
      </section>
    </main>
  )
}
