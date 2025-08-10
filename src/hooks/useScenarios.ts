import { useState, useCallback } from 'react'
import type { Scenario } from '../types'

// Random roleplay prompts for each scenario
const ROLEPLAY_PROMPTS = {
  cafe: [
    "Vous êtes dans un café parisien bondé. Le serveur semble pressé et vous devez commander rapidement votre petit-déjeuner avant un rendez-vous important.",
    "C'est votre premier jour à Paris et vous ne parlez pas bien français. Vous entrez dans un café local et devez commander quelque chose, mais la carte est entièrement en français.",
    "Vous êtes avec un ami français dans son café préféré. Il vous recommande de goûter leur spécialité, mais vous êtes végétarien et devez expliquer vos restrictions alimentaires.",
    "Il pleut dehors et vous cherchez un endroit pour vous réchauffer. Vous entrez dans un petit café et devez demander s'ils ont une table libre près de la fenêtre."
  ],
  directions: [
    "Vous êtes perdu dans le métro parisien avec une valise lourde. Votre train part dans 30 minutes et vous devez demander de l'aide pour trouver la bonne ligne.",
    "Vous cherchez un musée célèbre mais votre téléphone est déchargé. Vous devez demander des directions à un passant dans la rue.",
    "Vous êtes en retard pour un entretien d'embauche important. Vous connaissez l'adresse mais pas le chemin. Demandez de l'aide à quelqu'un.",
    "Vous visitez une petite ville française pour la première fois. Vous cherchez la pharmacie la plus proche car vous avez oublié vos médicaments."
  ],
  shopping: [
    "Vous cherchez un cadeau d'anniversaire pour votre mère dans une boutique chic. Vous avez un budget limité et devez négocier le prix.",
    "Vous êtes dans un marché français traditionnel. Vous voulez acheter des fruits frais mais vous ne connaissez pas les noms en français.",
    "Votre pantalon préféré s'est déchiré. Vous entrez dans un magasin de vêtements et devez expliquer ce que vous cherchez et votre taille.",
    "Vous préparez un dîner français pour des amis. Vous êtes dans une épicerie fine et devez demander des conseils pour choisir le bon fromage et le bon vin."
  ],
  restaurant: [
    "C'est votre anniversaire de mariage et vous dînez dans un restaurant gastronomique. Le serveur vous propose des plats que vous ne connaissez pas.",
    "Vous dînez avec votre patron français. Vous devez faire bonne impression mais vous ne comprenez pas la moitié de la carte.",
    "Vous avez des allergies alimentaires graves. Vous devez expliquer au serveur ce que vous ne pouvez pas manger et demander des alternatives.",
    "Vous êtes dans un petit bistrot familial. La grand-mère qui cuisine ne parle que français et veut savoir d'où vous venez et ce que vous aimez manger."
  ],
  hotel: [
    "Vous arrivez à votre hôtel à 2h du matin après un vol retardé. La réception semble fermée mais vous voyez une lumière. Vous devez récupérer vos clés.",
    "Il y a un problème avec votre chambre : la douche ne fonctionne pas et il fait très froid. Vous devez demander une autre chambre ou une réparation urgente.",
    "Vous avez perdu la clé de votre chambre et vous ne vous souvenez plus du numéro. Vous devez prouver votre identité à la réception.",
    "Vous partez tôt demain matin et devez organiser un taxi pour l'aéroport. Vous voulez aussi demander où prendre le petit-déjeuner à 6h du matin."
  ],
  transport: [
    "Vous êtes dans le métro parisien aux heures de pointe. Votre carte ne fonctionne pas et il y a une longue queue derrière vous.",
    "Vous devez prendre le dernier train pour rentrer chez vous, mais vous ne savez pas quel quai et l'annonce est en français rapide.",
    "Vous voyagez avec une poussette et des bagages. Vous devez demander de l'aide pour accéder au quai car il n'y a pas d'ascenseur.",
    "Vous avez acheté le mauvais type de ticket et le contrôleur vous demande de payer une amende. Vous devez expliquer votre erreur."
  ],
  pharmacy: [
    "Vous avez mal à la tête depuis trois jours et vous ne trouvez pas votre médicament habituel. Vous devez décrire vos symptômes au pharmacien.",
    "Votre enfant a de la fièvre en pleine nuit. Vous cherchez une pharmacie de garde et devez expliquer l'urgence de la situation.",
    "Vous avez une ordonnance de votre médecin étranger. Le pharmacien ne la reconnaît pas et vous devez expliquer votre traitement.",
    "Vous préparez une trousse de premiers secours pour un voyage. Vous devez demander conseil sur les médicaments essentiels à emporter."
  ],
  bank: [
    "Votre carte bancaire a été avalée par le distributeur automatique. Vous devez expliquer la situation et récupérer votre argent pour payer votre hôtel.",
    "Vous voulez ouvrir un compte bancaire en France mais vous ne comprenez pas tous les documents et les frais. Demandez des explications.",
    "Il y a une erreur sur votre relevé bancaire. Vous devez expliquer le problème et demander une correction.",
    "Vous devez envoyer de l'argent à votre famille à l'étranger de toute urgence. Demandez la méthode la plus rapide et la moins chère."
  ],
  doctor: [
    "Vous avez mal au ventre depuis hier soir. Vous ne savez pas si c'est grave et vous devez décrire vos symptômes précisément au médecin.",
    "Vous êtes tombé en faisant du vélo. Votre genou vous fait mal et vous pensez que c'est cassé. Expliquez ce qui s'est passé.",
    "Vous avez une allergie soudaine et votre visage gonfle. C'est une urgence et vous devez expliquer rapidement ce que vous avez mangé.",
    "Vous avez besoin d'un certificat médical pour votre travail, mais vous ne vous sentez pas vraiment malade. Expliquez votre situation délicate."
  ],
  social: [
    "Vous êtes à une fête où vous ne connaissez personne. Vous devez vous présenter et engager la conversation avec des inconnus.",
    "Vous rencontrez les parents de votre petit(e) ami(e) français(e) pour la première fois. Vous voulez faire bonne impression.",
    "Vous êtes nouveau dans votre quartier français. Vous rencontrez vos voisins et voulez créer de bonnes relations.",
    "Vous êtes dans un cours de français et devez faire une présentation sur votre pays. Les autres étudiants vous posent des questions difficiles."
  ]
}

const PREDEFINED_SCENARIOS: Scenario[] = [
  {
    id: 'cafe',
    title: 'En el Café',
    description: 'Practica pidiendo comida y bebidas en un café francés',
    icon: '☕',
    greeting: 'Bonjour ! Bienvenue dans notre café. Que puis-je vous servir aujourd\'hui ?'
  },
  {
    id: 'directions',
    title: 'Pidiendo Direcciones',
    description: 'Aprende a preguntar y dar direcciones en francés',
    icon: '🗺️',
    greeting: 'Bonjour ! Vous semblez perdu. Puis-je vous aider à trouver votre chemin ?'
  },
  {
    id: 'shopping',
    title: 'De Compras',
    description: 'Practica comprando en tiendas y mercados franceses',
    icon: '🛍️',
    greeting: 'Bonjour ! Bienvenue dans notre magasin. Cherchez-vous quelque chose en particulier ?'
  },
  {
    id: 'restaurant',
    title: 'En el Restaurante',
    description: 'Ordena comida y conversa con el mesero en francés',
    icon: '🍽️',
    greeting: 'Bonsoir ! Avez-vous une réservation ? Combien de personnes êtes-vous ?'
  },
  {
    id: 'hotel',
    title: 'En el Hotel',
    description: 'Practica el check-in y solicita servicios del hotel',
    icon: '🏨',
    greeting: 'Bonjour ! Bienvenue à l\'Hôtel Paris. Comment puis-je vous aider ?'
  },
  {
    id: 'transport',
    title: 'Transporte Público',
    description: 'Aprende a usar el transporte público en Francia',
    icon: '🚇',
    greeting: 'Bonjour ! Vous avez besoin d\'aide pour acheter un ticket ou trouver votre ligne ?'
  },
  {
    id: 'pharmacy',
    title: 'En la Farmacia',
    description: 'Solicita medicamentos y productos de salud',
    icon: '💊',
    greeting: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ? Avez-vous une ordonnance ?'
  },
  {
    id: 'bank',
    title: 'En el Banco',
    description: 'Realiza transacciones bancarias básicas en francés',
    icon: '🏦',
    greeting: 'Bonjour ! Bienvenue à la banque. Que puis-je faire pour vous aujourd\'hui ?'
  },
  {
    id: 'doctor',
    title: 'En el Médico',
    description: 'Describe síntomas y habla con profesionales de la salud',
    icon: '👩‍⚕️',
    greeting: 'Bonjour ! Je suis le docteur Martin. Qu\'est-ce qui vous amène aujourd\'hui ?'
  },
  {
    id: 'social',
    title: 'Conversación Social',
    description: 'Practica conversaciones casuales y presentaciones',
    icon: '👥',
    greeting: 'Salut ! Je m\'appelle Marie. Et vous, comment vous appelez-vous ?'
  }
]

export function useScenarios() {
  const [scenarios] = useState<Scenario[]>(PREDEFINED_SCENARIOS)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)

  const selectScenario = useCallback((scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    setCurrentScenario(scenario || null)
    return scenario
  }, [scenarios])

  const clearScenario = useCallback(() => {
    setCurrentScenario(null)
  }, [])

  const getScenarioById = useCallback((id: string) => {
    return scenarios.find(s => s.id === id)
  }, [scenarios])

  const getRandomRoleplayPrompt = useCallback((scenarioId: string) => {
    const prompts = ROLEPLAY_PROMPTS[scenarioId as keyof typeof ROLEPLAY_PROMPTS]
    if (!prompts || prompts.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * prompts.length)
    return prompts[randomIndex]
  }, [])

  const generateScenarioIntroduction = useCallback((scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    const roleplayPrompt = getRandomRoleplayPrompt(scenarioId)
    
    if (!scenario || !roleplayPrompt) return scenario?.greeting || ''
    
    return `🎭 **Situation:** ${roleplayPrompt}\n\n${scenario.greeting}`
  }, [scenarios, getRandomRoleplayPrompt])

  return {
    scenarios,
    currentScenario,
    selectScenario,
    clearScenario,
    getScenarioById,
    getRandomRoleplayPrompt,
    generateScenarioIntroduction
  }
}