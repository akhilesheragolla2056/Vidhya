import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle2 } from 'lucide-react'

const FALLBACK_VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'

/**
 * VideoLesson Component
 * YouTube video player with progress tracking and auto-play next
 */
export default function VideoLesson({ videoUrl, lessonId, courseId, onComplete, onNext, hasNext }) {
  const playerRef = useRef(null)
  const containerRef = useRef(null)
  const [player, setPlayer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [watchedPercentage, setWatchedPercentage] = useState(0)
  const [videoError, setVideoError] = useState(false)
  const fallbackVideoRef = useRef(null)

  // Extract YouTube video ID
  const getVideoId = url => {
    if (!url) return null
    try {
      if (url.includes('youtube.com/watch')) {
        return new URL(url).searchParams.get('v')
      }
      if (url.includes('youtube.com/shorts/')) {
        return url.split('shorts/')[1].split('?')[0]
      }
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0]
      }
      if (url.includes('youtube.com/embed/')) {
        return url.split('embed/')[1].split('?')[0]
      }
    } catch (e) {
      console.error('Invalid video URL:', e)
    }
    return null
  }

  const videoId = getVideoId(videoUrl)
  const isYouTube = Boolean(videoId)

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
  }, [])

  // Initialize YouTube Player
  useEffect(() => {
    if (!videoId || !containerRef.current || videoError) return

    const initPlayer = () => {
      try {
        const newPlayer = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: event => {
              setPlayer(event.target)
              setDuration(event.target.getDuration())
            },
            onStateChange: event => {
              // 0 = ended, 1 = playing, 2 = paused
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false)
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false)
                handleVideoComplete()
              }
            },
            onError: () => {
              setVideoError(true)
            },
          },
        })
        return newPlayer
      } catch (error) {
        console.error('YouTube player init failed, using fallback video:', error)
        setVideoError(true)
        return null
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [videoId])

  // Update progress periodically
  useEffect(() => {
    if (!player || !isPlaying) return

    const interval = setInterval(() => {
      const current = player.getCurrentTime()
      const total = player.getDuration()

      setCurrentTime(current)
      setProgress((current / total) * 100)

      // Track watched percentage (max watched)
      const percentage = Math.round((current / total) * 100)
      if (percentage > watchedPercentage) {
        setWatchedPercentage(percentage)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [player, isPlaying, watchedPercentage])

  const handleVideoComplete = () => {
    setWatchedPercentage(100)
    if (onComplete) {
      onComplete(lessonId, 100)
    }

    // Auto-play next video after 3 seconds
    if (hasNext && onNext) {
      setTimeout(() => {
        onNext()
      }, 3000)
    }
  }

  const togglePlay = () => {
    if (fallbackVideoRef.current) {
      if (isPlaying) {
        fallbackVideoRef.current.pause()
      } else {
        fallbackVideoRef.current.play().catch(() => {})
      }
      return
    }
    if (!player) return
    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  const toggleMute = () => {
    if (fallbackVideoRef.current) {
      fallbackVideoRef.current.muted = !fallbackVideoRef.current.muted
      setIsMuted(fallbackVideoRef.current.muted)
      return
    }
    if (!player) return
    if (isMuted) {
      player.unMute()
      setIsMuted(false)
    } else {
      player.mute()
      setIsMuted(true)
    }
  }

  const handleSeek = e => {
    if (fallbackVideoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const seekTime = pos * (fallbackVideoRef.current.duration || 0)
      fallbackVideoRef.current.currentTime = seekTime
      return
    }
    if (!player) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const seekTime = pos * duration
    player.seekTo(seekTime, true)
  }

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen()
      }
    }
  }

  const handleFallbackLoaded = e => {
    setDuration(e.currentTarget.duration || 0)
  }

  const handleFallbackTimeUpdate = e => {
    const current = e.currentTarget.currentTime || 0
    const total = e.currentTarget.duration || 0
    setCurrentTime(current)
    if (total > 0) {
      const percent = (current / total) * 100
      setProgress(percent)
      const watched = Math.round(percent)
      if (watched > watchedPercentage) {
        setWatchedPercentage(watched)
      }
    }
  }

  const handleFallbackEnded = () => {
    handleVideoComplete()
  }

  const fallbackSource = !isYouTube ? videoUrl : videoError ? FALLBACK_VIDEO_URL : null
  const safeFallbackSource =
    fallbackSource && fallbackSource.includes('youtube.com')
      ? FALLBACK_VIDEO_URL
      : fallbackSource

  return (
    <div ref={playerRef} className="relative group">
      {/* YouTube Player Container */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden">
        {safeFallbackSource ? (
          <video
            ref={fallbackVideoRef}
            className="w-full h-full"
            controls
            playsInline
            onLoadedMetadata={handleFallbackLoaded}
            onTimeUpdate={handleFallbackTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleFallbackEnded}
          >
            <source src={safeFallbackSource} type="video/mp4" />
          </video>
        ) : (
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {/* Progress Bar */}
        <div
          className="w-full h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer overflow-hidden pointer-events-auto"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors pointer-events-auto"
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white ml-0.5" />
              )}
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors pointer-events-auto"
            >
              {isMuted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} className="text-white" />
              )}
            </button>

            {/* Time */}
            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Watch Progress Badge */}
            {watchedPercentage > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-semibold">
                  {watchedPercentage}% watched
                </span>
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors pointer-events-auto"
          >
            <Maximize size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Video Complete Overlay */}
      {watchedPercentage === 100 && hasNext && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white text-2xl font-bold mb-2">Lesson Complete!</h3>
            <p className="text-gray-300 mb-4">Next video will play automatically...</p>
            <button
              onClick={onNext}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors"
            >
              Play Next Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

VideoLesson.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  lessonId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  onNext: PropTypes.func,
  hasNext: PropTypes.bool,
}
