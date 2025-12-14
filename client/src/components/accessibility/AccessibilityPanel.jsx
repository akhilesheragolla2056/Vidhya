import { useDispatch, useSelector } from 'react-redux'
import {
  toggleDyslexiaMode,
  toggleFocusMode,
  toggleHighContrast,
  setFontSize,
  toggleReducedMotion,
  toggleTextToSpeech,
  setColorBlindMode,
  toggleCaptions,
  resetSettings,
  toggleSettingsPanel,
} from '../../store/slices/accessibilitySlice'

function AccessibilityPanel() {
  const dispatch = useDispatch()
  const { settings } = useSelector((state) => state.accessibility)

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' },
  ]

  const colorBlindModes = [
    { value: 'none', label: 'None' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-label="Accessibility Settings">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => dispatch(toggleSettingsPanel())}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Accessibility Settings</h2>
            <button
              onClick={() => dispatch(toggleSettingsPanel())}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close accessibility panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Settings Groups */}
          <div className="space-y-6">
            {/* Reading Assistance */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Reading Assistance
              </h3>
              <div className="space-y-3">
                <ToggleSetting
                  label="Dyslexia-Friendly Font"
                  description="Use OpenDyslexic font for better readability"
                  checked={settings.dyslexiaMode}
                  onChange={() => dispatch(toggleDyslexiaMode())}
                />
                <ToggleSetting
                  label="Focus Mode"
                  description="Highlight current content, dim distractions"
                  checked={settings.focusMode}
                  onChange={() => dispatch(toggleFocusMode())}
                />
                <ToggleSetting
                  label="Text-to-Speech"
                  description="Read content aloud when selected"
                  checked={settings.textToSpeech}
                  onChange={() => dispatch(toggleTextToSpeech())}
                />
              </div>
            </section>

            {/* Visual Settings */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Visual Settings
              </h3>
              <div className="space-y-3">
                <ToggleSetting
                  label="High Contrast"
                  description="Increase contrast for better visibility"
                  checked={settings.highContrast}
                  onChange={() => dispatch(toggleHighContrast())}
                />
                <ToggleSetting
                  label="Reduced Motion"
                  description="Minimize animations and transitions"
                  checked={settings.reducedMotion}
                  onChange={() => dispatch(toggleReducedMotion())}
                />
                
                {/* Font Size */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Font Size
                  </label>
                  <div className="flex gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => dispatch(setFontSize(size.value))}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          settings.fontSize === size.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Blind Mode */}
                <div className="py-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Color Vision Support
                  </label>
                  <select
                    value={settings.colorBlindMode}
                    onChange={(e) => dispatch(setColorBlindMode(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {colorBlindModes.map((mode) => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Media Settings */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Media Settings
              </h3>
              <div className="space-y-3">
                <ToggleSetting
                  label="Captions"
                  description="Show captions for video content"
                  checked={settings.captionsEnabled}
                  onChange={() => dispatch(toggleCaptions())}
                />
              </div>
            </section>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <button
                onClick={() => dispatch(resetSettings())}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toggle setting component
function ToggleSetting({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export default AccessibilityPanel
