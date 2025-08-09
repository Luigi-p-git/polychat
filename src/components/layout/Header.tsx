import { Button } from '@/components/ui/button'
import { MessageCircle, BookOpen, AlertCircle, GraduationCap, Sparkles, Trash2 } from 'lucide-react'
import type { ConversationMode } from '../../types'

interface HeaderProps {
  mode: ConversationMode
  onModeChange: (mode: ConversationMode) => void
  onNewConversation: () => void
}

export function Header({ 
  mode, 
  onModeChange, 
  onNewConversation 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-foreground rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-background" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                PolyChat
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-muted/50 rounded-2xl p-1">
              <Button
                variant={mode === 'general' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('general')}
                className="rounded-xl h-9 px-4 font-medium transition-all duration-200 border-0"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                General
              </Button>
              <Button
                variant={mode === 'scenarios' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('scenarios')}
                className="rounded-xl h-9 px-4 font-medium transition-all duration-200 border-0"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Scenarios
              </Button>
              <Button
                variant={mode === 'teacher' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('teacher')}
                className="rounded-xl h-9 px-4 font-medium transition-all duration-200 border-0"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Teacher
              </Button>
            </div>

            <Button
              onClick={onNewConversation}
              size="sm"
              variant="outline"
              className="rounded-xl h-9 px-4 border-border/50 hover:bg-muted/50 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              New
            </Button>


          </div>
        </div>
      </div>
    </header>
  )
}