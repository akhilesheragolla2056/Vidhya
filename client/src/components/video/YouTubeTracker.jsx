import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../../services/api'

const YOUTUBE_API_URL = 'https://www.youtube.com/iframe_api'
let youtubeApiPromise

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      resolve(window.YT)
    }

    let script = document.querySelector(`script[src="${YOUTUBE_API_URL}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = YOUTUBE_API_URL
      script.async = true
      document.head.appendChild(script)
    }

    script.addEventListener('error', () => {
      youtubeApiPromise = null
      reject(new Error('YouTube player could not be loaded'))
    }, { once: true })
  })

  return youtubeApiPromise
}

function getVideoId(url) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('/')[0] || null
    if (parsed.hostname === 'youtube.com' || parsed.hostname.endsWith('.youtube.com')) {
      const match = parsed.pathname.match(/^\/(?:embed|shorts)\/([\w-]{6,20})/)
      return parsed.searchParams.get('v') || match?.[1] || null
    }
  } catch {
    return null
  }
  return null
}

export default function YouTubeTracker({ videoUrl, courseId, lessonId }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const lastSentAtRef = useRef(0)
  const [ready, setReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [watched, setWatched] = useState(0)
  const [playerError, setPlayerError] = useState(false)
  const videoId = getVideoId(videoUrl)

  const sendProgress = useCallback(async (playheadSeconds, videoDuration) => {
    if (!courseId || !lessonId || !videoDuration) return
    try {
      await api.post('/progress/video', {
        course: courseId,
        lessonId,
        videoDuration: Math.round(videoDuration),
        playheadSeconds: Math.round(playheadSeconds),
      })
    } catch {
      // Keep playback available when progress cannot be synchronized.
    }
  }, [courseId, lessonId])

  useEffect(() => {
    if (!videoId || !containerRef.current) return undefined
    let disposed = false
    setReady(false)
    setDuration(0)
    setWatched(0)
    setPlayerError(false)
    lastSentAtRef.current = 0

    loadYouTubeApi()
      .then(YT => {
        if (disposed || !containerRef.current) return
        const player = new YT.Player(containerRef.current, {
          videoId,
          playerVars: { rel: 0, modestbranding: 1, controls: 1, playsinline: 1 },
          events: {
            onReady: event => {
              if (disposed) return
              playerRef.current = event.target
              const videoDuration = event.target.getDuration() || 0
              setDuration(videoDuration)
              setReady(true)
            },
            onStateChange: event => {
              if (disposed || event.data !== YT.PlayerState.ENDED) return
              const videoDuration = event.target.getDuration() || 0
              const playheadSeconds = event.target.getCurrentTime() || videoDuration
              setWatched(playheadSeconds)
              void sendProgress(playheadSeconds, videoDuration)
            },
            onError: () => {
              if (!disposed) setPlayerError(true)
            },
          },
        })
        playerRef.current = player
      })
      .catch(() => {
        if (!disposed) setPlayerError(true)
      })

    return () => {
      disposed = true
      const player = playerRef.current
      playerRef.current = null
      try {
        player?.destroy()
      } catch {
        // The iframe may already have been removed by the browser.
      }
    }
  }, [videoId, sendProgress])

  useEffect(() => {
    if (!ready || !playerRef.current) return undefined

    const interval = window.setInterval(() => {
      try {
        const player = playerRef.current
        if (!player) return
        const playheadSeconds = player.getCurrentTime() || 0
        const videoDuration = player.getDuration() || duration
        setDuration(videoDuration)
        setWatched(previous => Math.max(previous, playheadSeconds))

        const now = Date.now()
        if (now - lastSentAtRef.current >= 5000) {
          lastSentAtRef.current = now
          void sendProgress(playheadSeconds, videoDuration)
        }
      } catch {
        // Ignore brief iframe API errors while the player is changing state.
      }
    }, 5000)

    return () => window.clearInterval(interval)
  }, [ready, duration, sendProgress])

  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center bg-slate-950 p-8 text-center text-slate-300">
        <p>{videoUrl ? 'This video link is not a supported YouTube URL.' : 'No video is available for this lesson.'}</p>
      </div>
    )
  }

  if (playerError) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-slate-950 p-8 text-center text-slate-200">
        <p>We could not load this lesson video.</p>
        <a href={videoUrl} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
          Open the video in a new tab
        </a>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="aspect-video w-full bg-slate-950" />
      <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white" aria-live="polite">
        {Math.round(watched)}s / {Math.round(duration)}s
      </div>
    </div>
  )
}
