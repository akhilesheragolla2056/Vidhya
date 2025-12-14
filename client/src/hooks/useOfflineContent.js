import { useState, useCallback, useEffect } from 'react'
import api from '../services/api'

export const useOfflineContent = () => {
  const [downloadedCourses, setDownloadedCourses] = useState([])
  const [downloading, setDownloading] = useState({})
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Cache API is supported
    setIsSupported('caches' in window)
    
    // Load list of downloaded courses
    loadDownloadedCourses()
  }, [])

  const loadDownloadedCourses = useCallback(async () => {
    if (!('caches' in window)) return

    try {
      const cache = await caches.open('offline-courses')
      const keys = await cache.keys()
      
      const courses = keys
        .map(request => {
          const url = new URL(request.url)
          const match = url.pathname.match(/\/api\/courses\/([^/]+)/)
          return match ? match[1] : null
        })
        .filter(Boolean)

      setDownloadedCourses([...new Set(courses)])
    } catch (error) {
      console.error('Error loading downloaded courses:', error)
    }
  }, [])

  const downloadCourse = useCallback(async (courseId) => {
    if (!('caches' in window)) {
      throw new Error('Offline storage not supported')
    }

    setDownloading(prev => ({ ...prev, [courseId]: { progress: 0, status: 'downloading' } }))

    try {
      // Fetch course data
      const courseResponse = await api.get(`/courses/${courseId}`)
      const course = courseResponse.data

      const cache = await caches.open('offline-courses')
      
      // Cache course info
      await cache.put(
        new Request(`/api/courses/${courseId}`),
        new Response(JSON.stringify(course), {
          headers: { 'Content-Type': 'application/json' },
        })
      )

      // Cache all lessons
      const totalLessons = course.modules?.reduce(
        (acc, m) => acc + (m.lessons?.length || 0),
        0
      ) || 0
      
      let completedLessons = 0

      for (const module of course.modules || []) {
        for (const lesson of module.lessons || []) {
          try {
            // Fetch lesson content
            const lessonResponse = await api.get(`/lessons/${lesson._id}`)
            
            await cache.put(
              new Request(`/api/lessons/${lesson._id}`),
              new Response(JSON.stringify(lessonResponse.data), {
                headers: { 'Content-Type': 'application/json' },
              })
            )

            completedLessons++
            setDownloading(prev => ({
              ...prev,
              [courseId]: {
                progress: Math.round((completedLessons / totalLessons) * 100),
                status: 'downloading',
              },
            }))
          } catch (error) {
            console.error(`Error downloading lesson ${lesson._id}:`, error)
          }
        }
      }

      setDownloading(prev => ({
        ...prev,
        [courseId]: { progress: 100, status: 'complete' },
      }))

      // Refresh downloaded courses list
      await loadDownloadedCourses()

      return true
    } catch (error) {
      setDownloading(prev => ({
        ...prev,
        [courseId]: { progress: 0, status: 'error', error: error.message },
      }))
      throw error
    }
  }, [loadDownloadedCourses])

  const removeCourse = useCallback(async (courseId) => {
    if (!('caches' in window)) return

    try {
      const cache = await caches.open('offline-courses')
      const keys = await cache.keys()

      // Remove course and all its lessons
      for (const request of keys) {
        const url = new URL(request.url)
        if (
          url.pathname.includes(`/courses/${courseId}`) ||
          url.pathname.includes('/lessons/')
        ) {
          await cache.delete(request)
        }
      }

      await loadDownloadedCourses()
    } catch (error) {
      console.error('Error removing course:', error)
    }
  }, [loadDownloadedCourses])

  const isDownloaded = useCallback((courseId) => {
    return downloadedCourses.includes(courseId)
  }, [downloadedCourses])

  const getStorageUsage = useCallback(async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: Math.round((estimate.usage / estimate.quota) * 100) || 0,
      }
    }
    return null
  }, [])

  return {
    isSupported,
    downloadedCourses,
    downloading,
    downloadCourse,
    removeCourse,
    isDownloaded,
    getStorageUsage,
  }
}

export default useOfflineContent
