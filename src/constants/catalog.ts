export const GENRES = [
  'MMORPG',
  'Shooter',
  'Strategy',
  'MOBA',
  'Card',
  'Battle Royale',
  'Sports',
  'Racing',
] as const

export const PLATFORMS = ['PC', 'Web Browser'] as const

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'
