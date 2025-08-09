import { Header } from './components/layout/Header'
import { ChatMessage } from './components/chat/ChatMessage'
import { ChatInput } from './components/chat/ChatInput'
import { ScenarioSelector } from './components/scenarios/ScenarioSelector'
import { EnhancedFlashcards } from './components/EnhancedFlashcards'
import { ErrorLog } from './components/ErrorLog'
import { Settings } from './components/Settings'
import { useConversation } from './hooks/useConversation'
import { useScenarios } from './hooks/useScenarios'
import { useSettings } from './hooks/useSettings'
import type { ConversationMode } from './types'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { useFlashcards } from './hooks/useFlashcards'
import { useErrorLog } from './hooks/useErrorLog'
import { ChevronLeft, ChevronRight, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [activeTab, setActiveTab] = useState('chat')
  const {
    messages,
    isLoading,
    mode,
    currentScenario,
    sendMessage,
    clearConversation,
    switchMode
  } = useConversation()

  const { scenarios, selectScenario, clearScenario } = useScenarios()
  const { settings, updateSetting } = useSettings()
  const {
    allCards,
    userCards,
    top300Cards,
    personalCards,
    currentCard,
    currentCardIndex,
    showAnswer,
    addCard,
    removeCard,
    nextCard,
    previousCard,
    toggleAnswer,
    resetCards
  } = useFlashcards()
  const { errors, addError, clearErrors, removeError } = useErrorLog()

  const handleModeChange = (newMode: ConversationMode) => {
    switchMode(newMode)
    if (newMode !== 'scenarios') {
      clearScenario()
    }
  }

  const renderChatContent = () => {
    if (mode === 'scenarios' && !currentScenario) {
      return (
        <div className="relative min-h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl m-6 p-8 shadow-2xl">
            <ScenarioSelector
              scenarios={scenarios}
              onSelectScenario={selectScenario}
              selectedScenario={currentScenario}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="relative h-full bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10zm10%200c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Messages Area with Glassmorphism */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-20">
                  <div className="relative">
                    {/* Gradient background with smooth edges */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-[2rem] blur-3xl" />
                    <div className="relative bg-card/30 backdrop-blur-2xl rounded-[2rem] p-12 shadow-2xl border border-white/5">
                      {/* Floating icon with glow effect */}
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-xl opacity-60 animate-pulse" />
                        <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl">
                          <span className="text-4xl filter drop-shadow-lg">💬</span>
                        </div>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-foreground mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {mode === 'general' && 'Commencez une conversation en français!'}
                        {mode === 'scenarios' && currentScenario && `Scénario: ${scenarios.find(s => s.id === currentScenario)?.title}`}
                        {mode === 'teacher' && 'Mode Professeur - Je vais corriger vos erreurs!'}
                      </h3>
                      
                      <p className="text-muted-foreground text-lg font-medium">
                        Tapez votre message ou utilisez le microphone pour parler.
                      </p>
                      
                      {/* Subtle decorative elements */}
                      <div className="flex justify-center mt-8 space-x-2">
                        <div className="w-2 h-2 bg-purple-400/40 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-blue-400/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
                        <div className="w-2 h-2 bg-indigo-400/40 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ChatMessage 
                      message={message} 
                      onAddToFlashcards={addCard}
                      onAddToErrorLog={addError}
                      culturalTipsEnabled={settings.culturalTipsEnabled}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Input Area with Seamless Design */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="relative backdrop-blur-2xl bg-card/20 border-t border-border/20">
              <div className="max-w-4xl mx-auto p-6">
                <div className="relative">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-[1.5rem] blur-2xl" />
                  <div className="relative bg-card/40 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-xl border border-white/5">
                    <ChatInput
                      onSendMessage={sendMessage}
                      isLoading={isLoading}
                      placeholder={
                        mode === 'scenarios' && currentScenario
                          ? `Parlez dans le contexte: ${scenarios.find(s => s.id === currentScenario)?.title}`
                          : 'Écrivez votre message en français...'
                      }
                      isCulturalTipsEnabled={settings.culturalTipsEnabled}
                      onToggleCulturalTips={() => updateSetting('culturalTipsEnabled', !settings.culturalTipsEnabled)}
                      scenario={mode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFlashcards = () => {
    return (
      <EnhancedFlashcards
        top300Cards={top300Cards}
        personalCards={personalCards}
        onRemoveCard={removeCard}
        onResetCards={resetCards}
      />
    )
  }

  const renderErrorLog = () => {
    return (
      <ErrorLog
        errors={errors}
        onRemoveError={removeError}
        onClearErrors={clearErrors}
      />
    )
  }

  return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Header */}
        <div className="relative z-20">
          <Header
            mode={mode}
            onModeChange={handleModeChange}
            onNewConversation={clearConversation}
          />
        </div>
        
        {/* Main Content */}
        <main className="container mx-auto px-6 py-6">
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative mb-8 bg-muted/30 backdrop-blur-sm border-0 rounded-2xl p-1 h-12">
                {/* Animated selector background */}
                <motion.div
                  className="absolute top-1 bottom-1 bg-white rounded-xl shadow-lg shadow-black/5"
                  initial={false}
                  animate={{
                    left: activeTab === 'chat' ? '0.25rem' : 
                          activeTab === 'flashcards' ? '25%' : 
                          activeTab === 'errors' ? '50%' : '75%',
                    width: 'calc(25% - 0.5rem)'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
                
                {/* Tab buttons */}
                <div className="relative grid w-full grid-cols-4 h-full">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`relative z-10 rounded-xl font-medium transition-colors duration-200 ${
                      activeTab === 'chat' ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`relative z-10 rounded-xl font-medium transition-colors duration-200 ${
                      activeTab === 'flashcards' ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => setActiveTab('errors')}
                    className={`relative z-10 rounded-xl font-medium transition-colors duration-200 ${
                      activeTab === 'errors' ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Errors
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`relative z-10 rounded-xl font-medium transition-colors duration-200 ${
                      activeTab === 'settings' ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Settings
                  </button>
                </div>
              </div>
              
              <TabsContent value="chat" className="h-full m-0">
                {renderChatContent()}
              </TabsContent>
              <TabsContent value="flashcards" className="h-full m-0 overflow-y-auto">
                {renderFlashcards()}
              </TabsContent>
              <TabsContent value="errors" className="h-full m-0 overflow-y-auto">
                {renderErrorLog()}
              </TabsContent>
              <TabsContent value="settings" className="h-full m-0 overflow-y-auto">
                <Settings />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
  )
}

export default App
