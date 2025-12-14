import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import {
  setSocket,
  setConnected,
  setParticipants,
  addParticipant,
  removeParticipant,
  addMessage,
  updateWhiteboard,
  startPoll,
  endPoll,
} from '../store/slices/classroomSlice'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export function useSocket(roomId) {
  const dispatch = useDispatch()
  const socketRef = useRef(null)
  const { isConnected, currentRoom } = useSelector((state) => state.classroom)
  const user = useSelector((state) => state.user.currentUser)

  // Connect to socket
  useEffect(() => {
    if (!roomId || !user) return

    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket
    dispatch(setSocket(socket))

    socket.on('connect', () => {
      dispatch(setConnected(true))
      socket.emit('join-room', { roomId, user })
    })

    socket.on('disconnect', () => {
      dispatch(setConnected(false))
    })

    socket.on('room-participants', (participants) => {
      dispatch(setParticipants(participants))
    })

    socket.on('user-joined', (participant) => {
      dispatch(addParticipant(participant))
    })

    socket.on('user-left', (userId) => {
      dispatch(removeParticipant(userId))
    })

    socket.on('chat-message', (message) => {
      dispatch(addMessage(message))
    })

    socket.on('whiteboard-update', (state) => {
      dispatch(updateWhiteboard(state))
    })

    socket.on('poll-started', (poll) => {
      dispatch(startPoll(poll))
    })

    socket.on('poll-ended', () => {
      dispatch(endPoll())
    })

    return () => {
      socket.emit('leave-room', { roomId })
      socket.disconnect()
      dispatch(setSocket(null))
      dispatch(setConnected(false))
    }
  }, [roomId, user, dispatch])

  // Send message
  const sendMessage = useCallback((content, type = 'text') => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', {
        roomId: currentRoom,
        content,
        type,
        sender: user,
      })
    }
  }, [isConnected, currentRoom, user])

  // Raise/lower hand
  const toggleHand = useCallback((isRaised) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('hand-raise', {
        roomId: currentRoom,
        userId: user?.id,
        isRaised,
      })
    }
  }, [isConnected, currentRoom, user])

  // Update whiteboard
  const sendWhiteboardUpdate = useCallback((state) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('whiteboard-draw', {
        roomId: currentRoom,
        state,
      })
    }
  }, [isConnected, currentRoom])

  // Start screen share
  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })
      return stream
    } catch (error) {
      console.error('Screen share failed:', error)
      return null
    }
  }, [])

  return {
    isConnected,
    sendMessage,
    toggleHand,
    sendWhiteboardUpdate,
    startScreenShare,
    socket: socketRef.current,
  }
}

export default useSocket
