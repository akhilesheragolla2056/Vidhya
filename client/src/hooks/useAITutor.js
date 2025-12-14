import { useState, useCallback, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addMessage, clearMessages, setLoading } from '../store/slices/aiTutorSlice'
import api from '../services/api'

export const useAITutor = () => {
  const dispatch = useDispatch()
  const { conversations, currentConversationId, mode, isLoading } = useSelector(
    (state) => state.aiTutor
  )
  
  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = currentConversation?.messages || []

  const sendMessage = useCallback(async (message, context = null) => {
    if (!message.trim() || isLoading) return

    // Add user message
    dispatch(addMessage({
      role: 'user',
      content: message,
    }))

    dispatch(setLoading(true))

    try {
      // Build history for API
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await api.post('/ai/chat', {
        message,
        context,
        mode,
        history,
      })

      // Add AI response
      dispatch(addMessage({
        role: 'assistant',
        content: response.data.message,
      }))
    } catch (error) {
      dispatch(addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
      }))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, messages, mode, isLoading])

  const getHint = useCallback(async (problemDescription, currentProgress, level = 1) => {
    dispatch(setLoading(true))

    try {
      const response = await api.post('/ai/hint', {
        problemDescription,
        currentProgress,
        level,
      })

      dispatch(addMessage({
        role: 'assistant',
        content: `**Hint (Level ${level}):**\n\n${response.data.hint}`,
        type: 'hint',
      }))

      return response.data
    } catch (error) {
      console.error('Error getting hint:', error)
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const getExplanation = useCallback(async (concept) => {
    dispatch(setLoading(true))

    try {
      const response = await api.post('/ai/explain', { concept })

      dispatch(addMessage({
        role: 'assistant',
        content: `**Explanation:**\n\n${response.data.explanation}\n\n**Examples:**\n\n${response.data.examples}`,
        type: 'explanation',
      }))

      return response.data
    } catch (error) {
      console.error('Error getting explanation:', error)
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const generatePractice = useCallback(async (topic, difficulty = 'medium', count = 3) => {
    dispatch(setLoading(true))

    try {
      const response = await api.post('/ai/practice', {
        topic,
        difficulty,
        count,
      })

      return response.data.problems
    } catch (error) {
      console.error('Error generating practice:', error)
      return []
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const clearConversation = useCallback(() => {
    dispatch(clearMessages())
  }, [dispatch])

  return {
    messages,
    isLoading,
    mode,
    sendMessage,
    getHint,
    getExplanation,
    generatePractice,
    clearConversation,
  }
}

export default useAITutor
