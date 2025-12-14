import { createSlice } from '@reduxjs/toolkit'

// Load settings from localStorage
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('accessibilitySettings')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const defaultSettings = {
  dyslexiaMode: false,
  focusMode: false,
  highContrast: false,
  fontSize: 'medium', // small, medium, large, xlarge
  lineSpacing: 'normal', // tight, normal, relaxed, loose
  reducedMotion: false,
  screenReader: false,
  textToSpeech: false,
  colorBlindMode: 'none', // none, protanopia, deuteranopia, tritanopia
  keyboardNavigation: true,
  audioDescriptions: false,
  captionsEnabled: true,
  signLanguageOverlay: false,
}

const initialState = {
  settings: loadSettings() || defaultSettings,
  isSettingsOpen: false,
}

const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState,
  reducers: {
    toggleDyslexiaMode: (state) => {
      state.settings.dyslexiaMode = !state.settings.dyslexiaMode
      saveSettings(state.settings)
    },
    toggleFocusMode: (state) => {
      state.settings.focusMode = !state.settings.focusMode
      saveSettings(state.settings)
    },
    toggleHighContrast: (state) => {
      state.settings.highContrast = !state.settings.highContrast
      saveSettings(state.settings)
    },
    setFontSize: (state, action) => {
      state.settings.fontSize = action.payload
      saveSettings(state.settings)
    },
    setLineSpacing: (state, action) => {
      state.settings.lineSpacing = action.payload
      saveSettings(state.settings)
    },
    toggleReducedMotion: (state) => {
      state.settings.reducedMotion = !state.settings.reducedMotion
      saveSettings(state.settings)
    },
    toggleTextToSpeech: (state) => {
      state.settings.textToSpeech = !state.settings.textToSpeech
      saveSettings(state.settings)
    },
    setColorBlindMode: (state, action) => {
      state.settings.colorBlindMode = action.payload
      saveSettings(state.settings)
    },
    toggleCaptions: (state) => {
      state.settings.captionsEnabled = !state.settings.captionsEnabled
      saveSettings(state.settings)
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload }
      saveSettings(state.settings)
    },
    resetSettings: (state) => {
      state.settings = defaultSettings
      saveSettings(state.settings)
    },
    toggleSettingsPanel: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen
    },
  },
})

// Helper function to save settings
const saveSettings = (settings) => {
  try {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save accessibility settings:', error)
  }
}

export const {
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
  toggleSettingsPanel,
} = accessibilitySlice.actions

export default accessibilitySlice.reducer
