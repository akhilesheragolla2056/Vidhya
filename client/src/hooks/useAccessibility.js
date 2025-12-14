import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  toggleDyslexiaMode,
  toggleFocusMode,
  toggleHighContrast,
  setFontSize,
  setLineSpacing,
  toggleReducedMotion,
  toggleTextToSpeech,
  setColorBlindMode,
  toggleCaptions,
  updateSettings,
  resetSettings,
} from '../store/slices/accessibilitySlice'

export function useAccessibility() {
  const dispatch = useDispatch()
  const { settings, isSettingsOpen } = useSelector((state) => state.accessibility)

  const toggleDyslexia = useCallback(() => {
    dispatch(toggleDyslexiaMode())
  }, [dispatch])

  const toggleFocus = useCallback(() => {
    dispatch(toggleFocusMode())
  }, [dispatch])

  const toggleContrast = useCallback(() => {
    dispatch(toggleHighContrast())
  }, [dispatch])

  const changeFontSize = useCallback((size) => {
    dispatch(setFontSize(size))
  }, [dispatch])

  const changeLineSpacing = useCallback((spacing) => {
    dispatch(setLineSpacing(spacing))
  }, [dispatch])

  const toggleMotion = useCallback(() => {
    dispatch(toggleReducedMotion())
  }, [dispatch])

  const toggleTTS = useCallback(() => {
    dispatch(toggleTextToSpeech())
  }, [dispatch])

  const changeColorBlindMode = useCallback((mode) => {
    dispatch(setColorBlindMode(mode))
  }, [dispatch])

  const toggleCaptionsEnabled = useCallback(() => {
    dispatch(toggleCaptions())
  }, [dispatch])

  const update = useCallback((newSettings) => {
    dispatch(updateSettings(newSettings))
  }, [dispatch])

  const reset = useCallback(() => {
    dispatch(resetSettings())
  }, [dispatch])

  // Text-to-speech helper
  const speak = useCallback((text, options = {}) => {
    if (!settings.textToSpeech) return
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1
      utterance.lang = options.lang || 'en-US'
      
      window.speechSynthesis.speak(utterance)
    }
  }, [settings.textToSpeech])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return {
    settings,
    isSettingsOpen,
    toggleDyslexia,
    toggleFocus,
    toggleContrast,
    changeFontSize,
    changeLineSpacing,
    toggleMotion,
    toggleTTS,
    changeColorBlindMode,
    toggleCaptionsEnabled,
    update,
    reset,
    speak,
    stopSpeaking,
  }
}

export default useAccessibility
