import { useEffect, useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '../services/api'
import {
  setConnected,
  joinRoom,
  leaveRoom,
  setCurrentUserId,
  setParticipants,
  setMessages,
  addParticipant,
  removeParticipant,
  addMessage,
  updateWhiteboard,
  startPoll,
  endPoll,
  setHandRaised,
  setRoomEnded,
} from '../store/slices/classroomSlice'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (
  import.meta.env.PROD
    ? new URL(API_BASE_URL, window.location.origin).origin
    : 'http://localhost:5000'
)

export function useSocket(roomId) {
  const dispatch = useDispatch()
  const socketRef = useRef(null)
  const { isConnected } = useSelector((state) => state.classroom)
  const [connectionError, setConnectionError] = useState('')
  const [iceServers, setIceServers] = useState([{ urls: 'stun:stun.l.google.com:19302' }])
  const user = useSelector((state) => state.user.currentUser)
  const userId = user?._id || user?.id

  // Connect to socket
  useEffect(() => {
    if (!roomId || !userId) return

    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket
    dispatch(joinRoom(roomId))
    dispatch(setCurrentUserId(userId))
    dispatch(setConnected(false))
    setConnectionError('')
    setIceServers([{ urls: 'stun:stun.l.google.com:19302' }])

    socket.on('connect', () => {
      socket.timeout(5000).emit('join-room', { roomId }, (error, response) => {
        if (error) {
          setConnectionError('The server did not confirm this classroom connection. Please reconnect.')
          return
        }
        if (!response?.success) {
          setConnectionError(response?.message || 'Could not join the classroom connection.')
          socket.disconnect()
          return
        }
        if (Array.isArray(response.iceServers) && response.iceServers.length) {
          setIceServers(response.iceServers)
        }
        setConnectionError('')
        dispatch(setConnected(true))
      })
    })

    socket.on('disconnect', () => {
      dispatch(setConnected(false))
    })

    socket.on('connect_error', error => {
      dispatch(setConnected(false))
      setConnectionError(error?.message || 'Could not connect to the classroom server.')
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

    socket.on('chat-history', history => {
      dispatch(setMessages(Array.isArray(history) ? history : []))
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

    socket.on('hand-raised', ({ userId: raisedUserId, isRaised }) => {
      dispatch(setHandRaised({ userId: raisedUserId, isRaised }))
    })

    socket.on('classroom-ended', () => {
      dispatch(setRoomEnded(true))
    })

    return () => {
      socket.emit('leave-room', { roomId })
      socket.disconnect()
      dispatch(setConnected(false))
      dispatch(leaveRoom())
    }
  }, [roomId, userId, dispatch])

  // Send message
  const sendMessage = useCallback((content, type = 'text') => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', {
        roomId,
        content,
        type,
      })
    }
  }, [isConnected, roomId])

  // Raise/lower hand
  const toggleHand = useCallback((isRaised) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('hand-raise', {
        roomId,
        isRaised,
      })
    }
  }, [isConnected, roomId])

  // Update whiteboard
  const sendWhiteboardUpdate = useCallback((state) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('whiteboard-draw', {
        roomId,
        state,
      })
    }
  }, [isConnected, roomId])

  const announceRoomEnded = useCallback(onComplete => {
    const socket = socketRef.current
    if (!socket?.connected) {
      onComplete?.(false)
      return
    }
    socket.timeout(1500).emit('announce-classroom-ended', { roomId }, (error, response) => {
      onComplete?.(!error && Boolean(response?.success))
    })
  }, [roomId])

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
    connectionError,
    iceServers,
    sendMessage,
    toggleHand,
    sendWhiteboardUpdate,
    announceRoomEnded,
    startScreenShare,
    socket: socketRef.current,
  }
}

export default useSocket
