import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, MicOff, Send, Loader2, Lightbulb } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  placeholder?: string
  isCulturalTipsEnabled?: boolean
  onToggleCulturalTips?: () => void
  scenario?: string
}

export function ChatInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Écris en français...",
  isCulturalTipsEnabled = false,
  onToggleCulturalTips,
  scenario
}: ChatInputProps) {
  const [message, setMessage] = useState('')
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

  return (
    <div className="relative">
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
            className="relative w-full bg-card/40 border border-white/5 text-foreground placeholder:text-muted-foreground rounded-[1.25rem] px-6 py-4 pr-16 backdrop-blur-xl focus:bg-card/60 focus:border-white/10 transition-all duration-300 text-base h-16 shadow-xl"
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