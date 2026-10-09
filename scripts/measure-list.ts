import { measureFilterCost } from '../src/utils/gamesList.ts'
import type { Game } from '../src/types/game.ts'

const sample: Game[] = [
  {
    id: 1,
    title: 'Eldoria Online',
    thumbnail: '',
    short_description: 'Mundo persistente com clãs e masmorras.',
    genre: 'MMORPG',
    platform: 'PC',
    game_url: 'https://example.com/jogos/eldoria-online',
  },
  {
    id: 2,
    title: 'Neon Strike',
    thumbnail: '',
    short_description: 'Tiro tático em arenas neon.',
    genre: 'Shooter',
    platform: 'PC',
    game_url: 'https://example.com/jogos/neon-strike',
  },
]

const result = measureFilterCost(sample)
console.log(JSON.stringify(result, null, 2))
