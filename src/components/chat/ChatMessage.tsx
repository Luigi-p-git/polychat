import type { Message } from '../../types'
import { formatTime } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Bot, Volume2, Plus, Lightbulb, Sparkles, Copy, CheckCircle, Languages } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ClickableText } from '../ClickableText'

interface ChatMessageProps {
  message: Message
  onAddToFlashcards?: (french: string, spanish: string) => void
  onWordClick?: (word: string) => void
  onAddToErrorLog?: (originalText: string, correctedText: string, explanation: string) => void
  culturalTipsEnabled?: boolean
}

export function ChatMessage({ message, onAddToFlashcards, onWordClick, onAddToErrorLog, culturalTipsEnabled = true }: ChatMessageProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAddedToLog, setIsAddedToLog] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)
  const [translatedText, setTranslatedText] = useState<string>('')
  const [isTranslating, setIsTranslating] = useState(false)

  const isUser = message.role === 'user'
  const isTyping = message.isTyping

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
    setShowTranslation(true)
    onWordClick?.(word)
  }

  const handleAddToErrorLog = () => {
    if (message.correction && onAddToErrorLog) {
      onAddToErrorLog(
        message.correction.original,
        message.correction.corrected,
        message.correction.explanation
      )
      setIsAddedToLog(true)
    }
  }

  const handleTranslate = async () => {
    if (isTranslated) {
      // Volver al texto original
      setIsTranslated(false)
      return
    }

    if (isTranslating) return

    setIsTranslating(true)
    try {
      // Simular traducción (aquí podrías integrar una API real de traducción)
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(message.content)}&langpair=fr|es`)
      const data = await response.json()
      
      if (data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText)
        setIsTranslated(true)
      } else {
        // Fallback: traducción simple simulada
        setTranslatedText(`[Traducción de: ${message.content}]`)
        setIsTranslated(true)
      }
    } catch (error) {
      console.error('Error al traducir:', error)
      // Fallback en caso de error
      setTranslatedText(`[Traducción de: ${message.content}]`)
      setIsTranslated(true)
    } finally {
      setIsTranslating(false)
    }
  }

  const getMessageBubbleStyle = () => {
    if (isUser) {
      return 'bg-gradient-to-br from-blue-500/90 to-blue-600/90 text-white border-blue-400/30'
    }
    
    if (message.messageType === 'correction') {
      return 'bg-gradient-to-br from-red-500/90 to-red-600/90 border-red-400/60 text-white shadow-red-500/25'
    }
    
    if (message.messageType === 'cultural-tip') {
      return 'bg-gradient-to-br from-blue-400/15 to-blue-500/15 border-blue-400/40 text-white'
    }
    
    return 'bg-gradient-to-br from-gray-500/10 to-gray-600/10 text-white border-white/10'
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isTyping) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-start space-x-4 mb-6"
      >
        <div className="flex-shrink-0">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
              <Bot className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            {/* Subtle glow effect for typing indicator */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-[1.5rem] blur-xl opacity-50" />
            <div className="relative bg-card/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-5 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-muted-foreground text-sm font-medium">PolyPal écrit...</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className="relative">
          {/* Subtle glow effect for messages */}
          <div className={`absolute inset-0 rounded-[1.5rem] blur-xl opacity-30 ${
            isUser 
              ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40' 
              : 'bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20'
          }`} />
          <div
            className={`relative rounded-[1.5rem] px-6 py-5 transition-all duration-300 backdrop-blur-xl border ${
              isUser
                ? 'bg-gradient-to-br from-blue-500/80 to-purple-500/80 text-white shadow-xl ml-12 border-white/10'
                : 'bg-card/40 text-foreground shadow-xl mr-12 border-white/5'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
          <div className="space-y-3">
            <div className="relative">
              <div className={`text-sm leading-relaxed font-medium ${
                isUser ? 'text-white' : 'text-white'
              }`}>
                {message.messageType === 'correction' ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full blur-sm opacity-75 animate-pulse" />
                        <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center shadow-lg">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-red-100 mb-3 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          ¡Corrección!
                        </p>
                        <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/30 mb-3">
                          <p className="text-sm text-red-100 font-medium mb-2">
                            <span className="text-red-300">Incorrecto:</span> {message.correction?.original}
                          </p>
                          <p className="text-sm text-white font-semibold">
                            <span className="text-green-300">Correcto:</span> {message.correction?.corrected}
                          </p>
                        </div>
                        {message.correction?.explanation && (
                          <p className="text-xs text-white/90 mb-3 bg-white/10 rounded-lg p-3 border border-white/20 leading-relaxed">
                            <span className="font-semibold text-white">Explicación:</span> {message.correction.explanation}
                          </p>
                        )}
                        <div className="flex space-x-2 mt-3">
                          {onAddToErrorLog && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddToErrorLog}
                              disabled={isAddedToLog}
                              className={`h-7 px-3 text-xs transition-all duration-200 backdrop-blur-sm ${
                                isAddedToLog
                                  ? 'bg-green-500/20 border-green-400/30 text-green-200'
                                  : 'bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 hover:border-red-400/50'
                              }`}
                            >
                              {isAddedToLog ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Añadido
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Añadir al diario
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : message.messageType === 'cultural-tip' ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur-sm opacity-75 animate-pulse" />
                        <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                          <Lightbulb className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-200 mb-2 flex items-center">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          {message.culturalTip?.title || 'Consejo Cultural'}
                        </p>
                        <p className="text-sm text-white/90 font-medium bg-white/5 rounded-lg p-2 border border-white/10">
                          {message.culturalTip?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : isUser ? (
                  <p>{isTranslated ? translatedText : message.content}</p>
                ) : (
                  <ClickableText
                    text={isTranslated ? translatedText : message.content}
                    onWordClick={onAddToFlashcards}
                  />
                )}
              </div>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-0 right-0 flex space-x-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(message.content)}
                    className="h-6 w-6 p-0 hover:bg-white/20 rounded-full"
                  >
                    <Copy className="h-3 w-3 text-white/70" />
                  </Button>
                  {!isUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(message.content)}
                      className="h-6 w-6 p-0 hover:bg-white/20 rounded-full"
                    >
                      <Volume2 className="h-3 w-3 text-white/70" />
                    </Button>
                  )}

                </motion.div>
              )}
            </div>
            
            <div className={`flex items-center pt-2 border-t border-white/10 ${
              isUser ? 'justify-end' : 'justify-between'
            }`}>
              <span className="text-xs text-white/50 font-medium">
                {formatTime(message.timestamp)}
              </span>
              {!isUser && (
                <div className="flex items-center space-x-2">
                  {!isHovered && (
                    <>
                      <Sparkles className="h-3 w-3 text-white/30" />
                      <span className="text-xs text-white/30">PolyPal</span>
                    </>
                  )}
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleTranslate}
                     disabled={isTranslating}
                     className={`h-5 w-5 p-0 rounded-full transition-all duration-200 ${
                       isTranslated 
                         ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                         : 'hover:bg-white/20 text-white/50 hover:text-white/80'
                     } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                     title={isTranslated ? 'Volver al texto original' : 'Traducir mensaje'}
                   >
                     <Languages className={`h-3 w-3 transition-all duration-200 ${
                       isTranslating ? 'animate-pulse' : ''
                     }`} />
                   </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  )
}