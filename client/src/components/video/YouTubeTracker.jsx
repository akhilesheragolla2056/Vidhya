import { useEffect, useRef, useState } from 'react'

// Lightweight YouTube player wrapper that reports real-time progress
// Props: videoUrl, courseId, lessonId
// Backend: POST /progress/video { user, course, lessonId, videoDuration, watchedDuration, completionPercentage }
export default function YouTubeTracker({ videoUrl, courseId, lessonId }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [watched, setWatched] = useState(0)
  const [lastSentAt, setLastSentAt] = useState(0)

  // Extract YouTube video ID from URL
  function getVideoId(url) {
    try {
      if (!url) return null
      if (url.includes('youtube.com/watch')) {
        const u = new URL(url)
        return u.searchParams.get('v')
      }
      if (url.includes('youtube.com/embed/')) {
        return url.split('embed/')[1].split('?')[0]
      }
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0]
      }
      return null
    } catch {
      return null
    }
  }

  // Load YT Iframe API
  useEffect(() => {
    if (window.YT && window.YT.Player) return
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.body.appendChild(script)
    return () => {
      // Don't remove script to avoid reloading across navigations
    }
  }, [])

  // Initialize player when API ready
  useEffect(() => {
    const videoId = getVideoId(videoUrl)
    if (!videoId || !containerRef.current) return

    function createPlayer() {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          controls: 1,
        },
        events: {
          onReady: e => {
            const d = e.target.getDuration() || 0
            setDuration(d)
            setReady(true)
          },
          onStateChange: ev => {
            // 1 playing, 2 paused, 0 ended
            if (ev.data === 0) {
              // ended
              setWatched(duration)
              sendProgress(duration, 100)
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      window.onYouTubeIframeAPIReady = () => createPlayer()
    }

    return () => {
      try {
        playerRef.current && playerRef.current.destroy()
      } catch {}
    }
  }, [videoUrl])

  // Poll playback time every 5s and send progress (throttled)
  useEffect(() => {
    if (!ready || !playerRef.current) return
    const interval = setInterval(() => {
      try {
        const current = playerRef.current.getCurrentTime() || 0
        const d = duration || playerRef.current.getDuration() || 0
        setDuration(d)
        setWatched(prev => (current > prev ? current : prev))
        const pct = d > 0 ? Math.min(100, Math.round((current / d) * 100)) : 0
        const now = Date.now()
        if (now - lastSentAt > 4000) {
          sendProgress(current, pct)
          setLastSentAt(now)
        }
      } catch {}
    }, 5000)
    return () => clearInterval(interval)
  }, [ready, duration, lastSentAt])

  async function sendProgress(current, pct) {
    try {
      const { default: api } = await import('../../services/api')
      await api.post('/progress/video', {
        course: courseId,
        lessonId,
        videoDuration: Math.round(duration),
        watchedDuration: Math.round(current),
        completionPercentage: pct,
        isCompleted: pct >= 80,
      })
    } catch (err) {
      // Swallow network errors; UI keeps playing
      console.log('Progress send failed', err?.message)
    }
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full aspect-video" />
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {Math.round(watched)}s / {Math.round(duration)}s
      </div>
    </div>
  )
}
