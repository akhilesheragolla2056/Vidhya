import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useSocket } from '../hooks/useSocket'
import { addMessage, toggleHandRaise } from '../store/slices/classroomSlice'
import { Settings, Users, Send, Hand, Video, Mic, MicOff, VideoOff, Share, MessageSquare, BookOpen, Code, Play } from 'lucide-react'

function Classroom() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const { messages, participants, isHandRaised, pollActive } = useSelector((state) => state.classroom)
  const { isConnected, sendMessage } = useSocket(id)
  const [messageInput, setMessageInput] = useState('')
  const [activeTab, setActiveTab] = useState('lesson')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageInput.trim()) {
      sendMessage(messageInput)
      setMessageInput('')
    }
  }

  const lesson = {
    title: 'Introduction to Variables in Python',
    videoUrl: null,
    content: `
      Variables are containers for storing data values. In Python, a variable is created the moment you first assign a value to it.
      
      Unlike other programming languages, Python has no command for declaring a variable. A variable is created when you first assign a value to it.
    `,
    codeExample: `# Creating variables
x = 5
y = "Hello"
print(x)
print(y)`,
  }

  const tabs = [
    { id: 'lesson', label: 'Lesson', icon: BookOpen },
    { id: 'whiteboard', label: 'Whiteboard', icon: Share },
    { id: 'code', label: 'Code', icon: Code },
  ]

  return (
    <div className="h-screen bg-surface-light flex flex-col">
      <div className="bg-primary text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold">{lesson.title}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-accent-cyan' : 'bg-red-500'}`}>
            {isConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users size={16} />
            <span>{participants.length || 12} participants</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3.5 font-medium flex items-center gap-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'lesson' && (
              <div className="max-w-3xl mx-auto">
                <div className="aspect-video bg-gray-900 rounded-2xl mb-6 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <Play size={32} />
                    </div>
                    <p className="text-gray-400">Video lesson would play here</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-text-primary mb-4">{lesson.title}</h2>
                  <p className="text-text-secondary leading-relaxed">{lesson.content}</p>
                  
                  <div className="bg-gray-900 rounded-xl p-5 mt-6">
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{lesson.codeExample}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whiteboard' && (
              <div className="h-full bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
                <div className="text-center text-text-muted">
                  <Share size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Interactive whiteboard</p>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="h-full bg-gray-900 rounded-2xl p-6">
                <pre className="text-green-400 text-sm">
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white border-t p-4 flex items-center justify-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-xl transition-colors ${isMuted ? 'bg-red-100 text-red-600' : 'bg-surface-light text-text-primary hover:bg-gray-200'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-xl transition-colors ${isVideoOff ? 'bg-red-100 text-red-600' : 'bg-surface-light text-text-primary hover:bg-gray-200'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            <button 
              onClick={() => dispatch(toggleHandRaise())}
              className={`p-3 rounded-xl transition-colors ${isHandRaised ? 'bg-accent-yellow text-white' : 'bg-surface-light text-text-primary hover:bg-gray-200'}`}
            >
              <Hand size={20} />
            </button>
            <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
              Leave
            </button>
          </div>
        </div>

        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            <h2 className="font-semibold text-text-primary">Chat</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(messages.length > 0 ? messages : [
              { user: 'Teacher', text: 'Welcome everyone! Today we are learning about Python variables.', time: '2:00 PM' },
              { user: 'Alex', text: 'Can variables store any type of data?', time: '2:01 PM' },
              { user: 'Teacher', text: 'Great question! Yes, Python variables are dynamically typed.', time: '2:01 PM' },
            ]).map((msg, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text-primary">{msg.user}</span>
                  <span className="text-xs text-text-muted">{msg.time}</span>
                </div>
                <p className="text-sm text-text-secondary bg-surface-light rounded-xl px-3 py-2">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
              <button type="submit" className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Classroom
