import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, RotateCcw, Trash2, BookOpen, Star, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FlashCard } from '../types'
import { useState, useEffect } from 'react'

interface EnhancedFlashcardsProps {
  top300Cards: FlashCard[]
  personalCards: FlashCard[]
  onRemoveCard: (id: string) => void
  onResetCards: () => void
}

export function EnhancedFlashcards({ 
  top300Cards, 
  personalCards, 
  onRemoveCard, 
  onResetCards 
}: EnhancedFlashcardsProps) {
  const [activeTab, setActiveTab] = useState('top300')
  const [currentTop300Index, setCurrentTop300Index] = useState(0)
  const [currentPersonalIndex, setCurrentPersonalIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizMode, setQuizMode] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [isAnswered, setIsAnswered] = useState(false)

  const currentCards = activeTab === 'top300' ? top300Cards : personalCards
  const currentIndex = activeTab === 'top300' ? currentTop300Index : currentPersonalIndex
  const currentCard = currentCards[currentIndex] || null

  // Generate quiz options with 3 wrong answers and 1 correct answer
  const generateQuizOptions = () => {
    if (!currentCard || currentCards.length < 4) {
      setQuizOptions([])
      return
    }

    const correctAnswer = currentCard.back
    const wrongAnswers: string[] = []
    
    // Get 3 random wrong answers from other cards
    const otherCards = currentCards.filter((_, index) => index !== currentIndex)
    const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
      wrongAnswers.push(shuffledOthers[i].back)
    }
    
    // If we don't have enough cards, add some generic wrong answers
    while (wrongAnswers.length < 3) {
      const genericAnswers = ['palabra', 'respuesta', 'opción', 'texto', 'ejemplo']
      const randomGeneric = genericAnswers[Math.floor(Math.random() * genericAnswers.length)]
      if (!wrongAnswers.includes(randomGeneric) && randomGeneric !== correctAnswer) {
        wrongAnswers.push(randomGeneric)
      }
    }
    
    // Combine and shuffle all options
    const allOptions = [correctAnswer, ...wrongAnswers]
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5)
    setQuizOptions(shuffledOptions)
  }

  const nextCard = () => {
    if (activeTab === 'top300') {
      setCurrentTop300Index(prev => (prev + 1) % top300Cards.length)
    } else {
      setCurrentPersonalIndex(prev => (prev + 1) % personalCards.length)
    }
    setShowAnswer(false)
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  const previousCard = () => {
    if (activeTab === 'top300') {
      setCurrentTop300Index(prev => prev === 0 ? top300Cards.length - 1 : prev - 1)
    } else {
      setCurrentPersonalIndex(prev => prev === 0 ? personalCards.length - 1 : prev - 1)
    }
    setShowAnswer(false)
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(answer)
    setIsAnswered(true)
    setShowAnswer(true)
  }

  const handleQuizAnswer = (answer: string) => {
    handleAnswerSelect(answer)
  }

  // Generate quiz options when card changes
  useEffect(() => {
    if (quizMode && currentCard) {
      generateQuizOptions()
    }
  }, [currentCard, quizMode, currentIndex, activeTab])

  const toggleAnswer = () => {
    setShowAnswer(prev => !prev)
  }

  const toggleQuizMode = () => {
    setQuizMode(prev => !prev)
    setShowAnswer(false)
    setSelectedAnswer(null)
    if (!quizMode) {
      generateQuizOptions()
    }
  }

  const resetCurrentDeck = () => {
    if (activeTab === 'top300') {
      setCurrentTop300Index(0)
    } else {
      setCurrentPersonalIndex(0)
    }
    setShowAnswer(false)
    setSelectedAnswer(null)
    onResetCards()
  }

  if (!currentCard) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-card/50 backdrop-blur-sm border-0 rounded-3xl p-12 text-center shadow-lg max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {activeTab === 'top300' ? 'Aucune carte Top 300 disponible' : 'Aucune carte personnelle'}
            </h3>
            <p className="text-muted-foreground">
              {activeTab === 'top300' 
                ? 'Les cartes de base seront bientôt disponibles!' 
                : 'Commencez une conversation et cliquez sur les mots français pour créer vos cartes personnalisées!'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
        {/* Header with Tabs */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Cartes Flash</h2>
              <p className="text-muted-foreground">Révisez votre vocabulaire français</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={toggleQuizMode} 
                variant={quizMode ? "default" : "outline"}
                size="lg" 
                className="rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm border-0"
              >
                {quizMode ? 'Mode Révision' : 'Mode Quiz'}
              </Button>
              <Button 
                onClick={resetCurrentDeck} 
                variant="outline" 
                size="lg" 
                className="rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm border-0"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/30 backdrop-blur-sm border-0 rounded-2xl p-1 h-12">
              <TabsTrigger 
                value="top300" 
                className="rounded-xl transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-black/5 border-0 font-medium"
              >
                <Star className="w-4 h-4 mr-2" />
                Top 300 ({top300Cards.length})
              </TabsTrigger>
              <TabsTrigger 
                value="personal" 
                className="rounded-xl transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-black/5 border-0 font-medium"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Mis Palabras ({personalCards.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-card/50 backdrop-blur-sm border-0 rounded-3xl p-8 mb-8 shadow-lg"
          >
            <div className="text-center space-y-8">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Carte {currentIndex + 1} de {currentCards.length}
              </div>
              
              {/* French Word */}
              <div className="bg-muted/20 rounded-3xl p-8 border-0">
                <h3 className="text-4xl font-bold text-foreground mb-3">
                  {currentCard.front}
                </h3>
                {currentCard.example && (
                  <p className="text-muted-foreground italic text-base">
                    "{currentCard.example}"
                  </p>
                )}
              </div>

              {/* Quiz Mode */}
              {quizMode && !isAnswered && (
                <div className="space-y-6">
                  <p className="text-foreground text-lg font-medium">Choisissez la traduction correcte:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {quizOptions.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleQuizAnswer(option)}
                        variant="outline"
                        className="h-16 text-lg rounded-2xl border-0 bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Results */}
              {quizMode && isAnswered && (
                <div className="space-y-6">
                  <p className="text-foreground text-lg font-medium">Résultat:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {quizOptions.map((option, index) => {
                      const isCorrect = option === currentCard.back
                      const isSelected = option === selectedAnswer
                      let buttonClass = "h-16 text-lg rounded-2xl border-0 transition-all duration-300"
                      
                      if (isSelected && isCorrect) {
                        buttonClass += " bg-green-500/20 text-green-600 dark:text-green-400"
                      } else if (isSelected && !isCorrect) {
                        buttonClass += " bg-red-500/20 text-red-600 dark:text-red-400"
                      } else if (!isSelected && isCorrect) {
                        buttonClass += " bg-green-500/10 text-green-600 dark:text-green-400"
                      } else {
                        buttonClass += " bg-muted/30 text-muted-foreground"
                      }
                      
                      return (
                        <Button
                          key={index}
                          disabled
                          variant="outline"
                          className={buttonClass}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span>{option}</span>
                            {isSelected && isCorrect && <Check className="w-5 h-5" />}
                            {isSelected && !isCorrect && <X className="w-5 h-5" />}
                            {!isSelected && isCorrect && <Check className="w-5 h-5" />}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-semibold ${
                      selectedAnswer === currentCard.back 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {selectedAnswer === currentCard.back 
                        ? '¡Correcto! 🎉' 
                        : `Incorrect. La bonne réponse est: ${currentCard.back}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Answer Display - Only for Review Mode */}
              {!quizMode && showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 rounded-3xl p-6 border-0"
                >
                  <h4 className="text-2xl font-bold text-primary mb-2">
                    {currentCard.back}
                  </h4>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={previousCard}
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-0 bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                {!quizMode && (
                  <Button
                    onClick={toggleAnswer}
                    variant="default"
                    size="lg"
                    className="rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                  >
                    {showAnswer ? 'Masquer' : 'Révéler'}
                  </Button>
                )}
                
                <Button
                  onClick={nextCard}
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-0 bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                {activeTab === 'personal' && (
                  <Button
                    onClick={() => onRemoveCard(currentCard.id)}
                    variant="outline"
                    size="lg"
                    className="rounded-2xl border-0 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="bg-card/50 backdrop-blur-sm border-0 rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground text-sm font-medium">
              Progrès: {currentIndex + 1} / {currentCards.length}
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              {Math.round(((currentIndex + 1) / currentCards.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / currentCards.length) * 100}%` }}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedFlashcards