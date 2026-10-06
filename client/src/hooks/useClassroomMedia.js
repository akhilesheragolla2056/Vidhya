import { useCallback, useEffect, useRef, useState } from 'react'

const rtcConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

export function useClassroomMedia({ socket, roomId, participants, currentUserId, isConnected }) {
  const peerConnections = useRef(new Map())
  const localStreamRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState({})
  const [cameraOn, setCameraOn] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [mediaError, setMediaError] = useState('')

  const sendSignal = useCallback((targetUserId, signal) => {
    if (!socket?.connected || !roomId) return
    socket.emit('rtc-signal', { roomId, targetUserId: String(targetUserId), signal })
  }, [roomId, socket])

  const makePeer = useCallback(peerUserId => {
    const id = String(peerUserId)
    const existing = peerConnections.current.get(id)
    if (existing) return existing

    const connection = new RTCPeerConnection(rtcConfiguration)
    const audioTransceiver = connection.addTransceiver('audio', { direction: 'sendrecv' })
    const videoTransceiver = connection.addTransceiver('video', { direction: 'sendrecv' })
    const localAudio = localStreamRef.current?.getAudioTracks()[0]
    const localVideo = localStreamRef.current?.getVideoTracks()[0]
    if (localAudio) void audioTransceiver.sender.replaceTrack(localAudio)
    if (localVideo) void videoTransceiver.sender.replaceTrack(localVideo)
    const entry = {
      connection,
      audioSender: audioTransceiver.sender,
      videoSender: videoTransceiver.sender,
      pendingCandidates: [],
    }
    peerConnections.current.set(id, entry)

    connection.onicecandidate = event => {
      if (event.candidate) sendSignal(id, { candidate: event.candidate })
    }
    connection.ontrack = event => {
      const stream = event.streams?.[0] || new MediaStream([event.track])
      setRemoteStreams(previous => ({ ...previous, [id]: stream }))
    }
    connection.onconnectionstatechange = () => {
      if (connection.connectionState === 'failed' || connection.connectionState === 'closed') {
        connection.close()
        peerConnections.current.delete(id)
        setRemoteStreams(previous => {
          const next = { ...previous }
          delete next[id]
          return next
        })
      }
    }
    return entry
  }, [sendSignal])

  const makeOffer = useCallback(async userId => {
    const entry = makePeer(userId)
    if (entry.connection.signalingState !== 'stable') return
    try {
      const offer = await entry.connection.createOffer()
      await entry.connection.setLocalDescription(offer)
      sendSignal(userId, { description: entry.connection.localDescription })
    } catch {
      setMediaError('Could not start the audio/video connection. Please try again.')
    }
  }, [makePeer, sendSignal])

  useEffect(() => {
    if (!socket || !isConnected || !currentUserId || !roomId) return undefined
    if (typeof RTCPeerConnection === 'undefined') {
      setMediaError('Live audio and video are not supported by this browser.')
      return undefined
    }

    const onSignal = async ({ senderId, signal } = {}) => {
      if (!senderId || !signal) return
      const entry = makePeer(senderId)
      const connection = entry.connection
      try {
        if (signal.description) {
          await connection.setRemoteDescription(signal.description)
          while (entry.pendingCandidates.length) {
            await connection.addIceCandidate(entry.pendingCandidates.shift())
          }
          if (signal.description.type === 'offer') {
            const answer = await connection.createAnswer()
            await connection.setLocalDescription(answer)
            sendSignal(senderId, { description: connection.localDescription })
          }
        } else if (signal.candidate) {
          if (connection.remoteDescription) await connection.addIceCandidate(signal.candidate)
          else entry.pendingCandidates.push(signal.candidate)
        }
      } catch {
        setMediaError('A participant audio/video connection could not be established.')
      }
    }

    socket.on('rtc-signal', onSignal)
    const peers = participants.filter(participant => String(participant.id) !== String(currentUserId))
    peers.forEach(participant => {
      const peerId = String(participant.id)
      makePeer(peerId)
      // One side starts negotiation for each pair to avoid two offers crossing.
      if (String(currentUserId) < peerId) void makeOffer(peerId)
    })

    return () => socket.off('rtc-signal', onSignal)
  }, [currentUserId, isConnected, makeOffer, makePeer, participants, roomId, sendSignal, socket])

  const addLocalMedia = useCallback(async kind => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError('Camera and microphone need a supported browser on HTTPS or localhost.')
      return false
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: kind === 'audio',
        video: kind === 'video' ? { width: { ideal: 640 }, height: { ideal: 360 } } : false,
      })
      const track = stream.getTracks()[0]
      let combined = localStreamRef.current
      if (!combined) combined = new MediaStream()
      combined.addTrack(track)
      localStreamRef.current = combined
      setLocalStream(combined)

      peerConnections.current.forEach(entry => {
        const sender = kind === 'audio' ? entry.audioSender : entry.videoSender
        void sender.replaceTrack(track)
      })
      setMediaError('')
      return true
    } catch {
      setMediaError(kind === 'video'
        ? 'Camera access was blocked or unavailable. Check your browser permissions.'
        : 'Microphone access was blocked or unavailable. Check your browser permissions.')
      return false
    }
  }, [])

  const toggleCamera = useCallback(async () => {
    const track = localStreamRef.current?.getVideoTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setCameraOn(track.enabled)
      return
    }
    if (await addLocalMedia('video')) setCameraOn(true)
  }, [addLocalMedia])

  const toggleMic = useCallback(async () => {
    const track = localStreamRef.current?.getAudioTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setMicOn(track.enabled)
      return
    }
    if (await addLocalMedia('audio')) setMicOn(true)
  }, [addLocalMedia])

  useEffect(() => () => {
    peerConnections.current.forEach(({ connection }) => connection.close())
    peerConnections.current.clear()
    localStreamRef.current?.getTracks().forEach(track => track.stop())
    localStreamRef.current = null
  }, [roomId])

  return { localStream, remoteStreams, cameraOn, micOn, mediaError, toggleCamera, toggleMic }
}
