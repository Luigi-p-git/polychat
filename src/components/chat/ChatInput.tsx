import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, MicOff, Send, Loader2, Lightbulb, Theater, ChevronDown, Sparkles } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { motion, AnimatePresence } from 'framer-motion'
import type { Scenario } from '../../types'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  placeholder?: string
  isCulturalTipsEnabled?: boolean
  onToggleCulturalTips?: () => void
  scenario?: string
  scenarios?: Scenario[]
  onSelectScenario?: (scenarioId: string | null) => void
  currentScenario?: string | null
}

export function ChatInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Écris en français...",
  isCulturalTipsEnabled = false,
  onToggleCulturalTips,
  scenario,
  scenarios = [],
  onSelectScenario,
  currentScenario
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [showScenarios, setShowScenarios] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition()

  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(transcript)
    }
  }, [transcript])

  // Focus input when not listening
  useEffect(() => {
    if (!isListening && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isListening])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
      resetTranscript()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
      setMessage('') // Clear current message when starting to listen
    }
  }

  const handleScenarioSelect = (scenarioId: string | null) => {
    onSelectScenario?.(scenarioId)
    setShowScenarios(false)
  }

  const getCurrentScenarioTitle = () => {
    if (!currentScenario) return 'Conversación General'
    const scenario = scenarios.find(s => s.id === currentScenario)
    return scenario?.title || 'Conversación General'
  }

  return (
    <div className="relative">
      {/* Scenario Selector */}
      {scenarios.length > 0 && (
        <div className="mb-4">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowScenarios(!showScenarios)}
              className="w-full justify-between h-12 rounded-[1rem] border-white/10 bg-card/40 backdrop-blur-xl text-white hover:bg-card/60 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-sm opacity-75 ${
                    currentScenario 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                  }`} />
                  <div className={`relative h-8 w-8 rounded-full flex items-center justify-center shadow-lg ${
                    currentScenario 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                      : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                  }`}>
                    {currentScenario ? (
                      <span className="text-lg">{scenarios.find(s => s.id === currentScenario)?.icon || '🎭'}</span>
                    ) : (
                      <Sparkles className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
                <span className="font-medium">{getCurrentScenarioTitle()}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                showScenarios ? 'rotate-180' : ''
              }`} />
            </Button>
            
            <AnimatePresence>
              {showScenarios && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 backdrop-blur-xl bg-card/90 border border-white/20 rounded-[1rem] shadow-2xl overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleScenarioSelect(null)}
                      className={`w-full justify-start h-10 rounded-lg transition-all duration-200 ${
                        !currentScenario 
                          ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-sm opacity-75" />
                          <div className="relative h-6 w-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <span className="font-medium">Conversación General</span>
                      </div>
                    </Button>
                    
                    {scenarios.map((scenario) => (
                      <Button
                        key={scenario.id}
                        type="button"
                        variant="ghost"
                        onClick={() => handleScenarioSelect(scenario.id)}
                        className={`w-full justify-start h-12 rounded-lg transition-all duration-200 ${
                          currentScenario === scenario.id 
                            ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm opacity-75" />
                            <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                              <span className="text-lg">{scenario.icon}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium block">{scenario.title}</span>
                            <span className="text-white/60 text-xs">{scenario.description}</span>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative flex items-center space-x-4">
        <div className="flex-1 relative">
          {/* Subtle glow effect for input */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-[1.25rem] blur-lg opacity-60" />
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Escuchando..." : placeholder}
            disabled={isLoading || isListening}
            className="relative w-full bg-card/40 border border-white/5 text-foreground placeholder:text-muted-foreground rounded-[1.25rem] px-6 py-4 pr-16 backdrop-blur-xl focus:bg-card/60 focus:border-white/10 transition-all duration-300 text-base h-16 shadow-xl tracking-normal"
          />
            
            {/* Voice input button */}
            {isSupported && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                disabled={isLoading}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-xl transition-all duration-300 border-0 ${
                  isListening ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isListening ? (
                    <motion.div
                      key="listening"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="relative"
                    >
                      <MicOff className="h-4 w-4" />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="not-listening"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Mic className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}
          </div>
          
        {/* Send button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[1rem] blur-lg opacity-60" />
          <Button
            type="submit"
            disabled={isLoading || !message.trim() || isListening}
            className="relative h-16 px-6 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500/90 hover:to-purple-500/90 text-white font-medium rounded-[1rem] shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 backdrop-blur-xl"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Cultural Tips Toggle */}
        {onToggleCulturalTips && scenario !== 'teacher' && (
          <div className="relative">
            <div className={`absolute inset-0 rounded-[1rem] blur-lg opacity-60 ${
              isCulturalTipsEnabled
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'
                : 'bg-gradient-to-r from-gray-500/10 to-gray-600/10'
            }`} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleCulturalTips}
              disabled={isLoading}
              className={`relative h-16 w-16 rounded-[1rem] border transition-all duration-300 backdrop-blur-xl shadow-xl ${
                isCulturalTipsEnabled
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 hover:border-yellow-500/50'
                  : 'bg-card/40 border-white/5 text-muted-foreground hover:border-white/10 hover:text-foreground hover:bg-card/60'
              }`}
              title={isCulturalTipsEnabled ? 'Désactiver les conseils culturels' : 'Activer les conseils culturels'}
            >
              <Lightbulb className={`h-5 w-5 ${
                isCulturalTipsEnabled ? 'animate-pulse' : ''
              }`} />
            </Button>
          </div>
        )}
      </form>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-[1rem] blur-lg opacity-60" />
              <div className="relative bg-card/40 backdrop-blur-xl border border-red-500/20 rounded-[1rem] p-3 shadow-xl">
                <p className="text-sm text-red-400 font-medium">
                  Error de reconocimiento de voz: {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Voice recognition status */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-[1rem] blur-lg opacity-60" />
              <div className="relative bg-card/40 backdrop-blur-xl border border-red-500/20 rounded-[1rem] p-4 shadow-xl">
                <div className="flex items-center space-x-3 text-sm text-red-400">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-red-500 rounded animate-pulse shadow-lg" />
                    <div className="w-1 h-4 bg-red-500 rounded animate-pulse shadow-lg" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-4 bg-red-500 rounded animate-pulse shadow-lg" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="font-medium">Escuchando... Habla en francés</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}