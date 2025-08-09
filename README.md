# PolyChat 🇫🇷➡️🇪🇸

An interactive French-Spanish conversation practice application powered by AI, designed to help Spanish speakers learn French through immersive conversations and smart flashcard creation.

## ✨ Features

### 🗣️ Interactive Conversations
- **AI-Powered Chat**: Practice French with an intelligent AI tutor
- **Scenario-Based Learning**: Choose from various real-life scenarios:
  - 🍽️ Restaurant conversations
  - ✈️ Travel and tourism
  - 💼 Business meetings
  - 🏥 Medical appointments
  - 🛍️ Shopping experiences
  - 🎓 Academic discussions

### 📚 Smart Flashcard System
- **Clickable Words**: Click any French word in AI responses for instant translation
- **Auto-Generated Flashcards**: Create personalized flashcards with:
  - French word (front)
  - Spanish translation (back)
  - Usage examples
  - Difficulty levels
  - Grammar categories
- **Personal Collection**: Build your own "Mis Palabras" (My Words) deck
- **Top 300 Words**: Access pre-loaded essential French vocabulary

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes for comfortable learning
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Safari Compatible**: Optimized for all major browsers including Safari
- **Smooth Animations**: Enhanced user experience with Framer Motion

### 🤖 AI Integration
- **Google Gemini API**: Advanced language processing for natural conversations
- **Smart Translation**: Context-aware translations with grammar insights
- **Dynamic Content**: AI generates relevant examples and explanations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Luigi-p-git/polychat.git
   cd polychat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Google Gemini API key to `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 How to Use

### Starting a Conversation
1. Choose a learning scenario from the main menu
2. Begin chatting in French with the AI tutor
3. Receive contextual responses and corrections

### Creating Flashcards
1. Click on any French word in AI responses
2. View instant translation and grammar information
3. Click "Añadir" (Add) to save to your personal flashcard collection
4. Access your cards in the "Mis Palabras" tab

### Studying with Flashcards
1. Navigate to the Flashcards section
2. Choose between "Top 300" common words or "Personal" cards
3. Use quiz mode for active recall practice
4. Track your progress and review difficult words

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **AI Integration**: Google Gemini API
- **State Management**: React Hooks (useState, useCallback, useEffect)
- **Icons**: Lucide React

## 📁 Project Structure

```
polychat/
├── src/
│   ├── components/          # React components
│   │   ├── chat/            # Chat-related components
│   │   ├── layout/          # Layout components
│   │   ├── scenarios/       # Scenario selection
│   │   ├── ui/              # Reusable UI components
│   │   ├── ClickableText.tsx # Word interaction logic
│   │   ├── EnhancedFlashcards.tsx # Flashcard system
│   │   └── Settings.tsx     # App configuration
│   ├── hooks/               # Custom React hooks
│   │   ├── useConversation.ts # Chat management
│   │   ├── useFlashcards.ts   # Flashcard logic
│   │   ├── useScenarios.ts    # Scenario handling
│   │   └── useSettings.ts     # App settings
│   ├── services/            # External API services
│   │   ├── geminiService.ts   # Google Gemini integration
│   │   └── translationService.ts # Translation logic
│   ├── types/               # TypeScript type definitions
│   └── lib/                 # Utility functions
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🔧 Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for AI conversations

### Customization
- **Scenarios**: Add new conversation scenarios in `src/hooks/useScenarios.ts`
- **Vocabulary**: Extend the Top 300 words list in `src/hooks/useFlashcards.ts`
- **Themes**: Customize colors and styling in `src/index.css`

## 🌟 Key Features in Detail

### Intelligent Word Detection
- Automatically identifies French words in AI responses
- Provides hover tooltips with quick translations
- Handles complex grammar forms and conjugations

### Advanced Flashcard Creation
- Uses AI to generate contextual examples
- Categorizes words by difficulty and grammar type
- Prevents duplicate entries automatically
- Supports rich metadata (hints, categories, examples)

### Cross-Browser Compatibility
- Optimized click handlers for Safari
- Responsive design for all screen sizes
- Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for powerful AI language processing
- **shadcn/ui** for beautiful, accessible UI components
- **Tailwind CSS** for rapid styling development
- **Framer Motion** for smooth animations
- **Lucide** for consistent iconography

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Luigi-p-git/polychat/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Learning! 🎉 ¡Feliz Aprendizaje!**

*PolyChat - Making French learning interactive, engaging, and effective for Spanish speakers.*
