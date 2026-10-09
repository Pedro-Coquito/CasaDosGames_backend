export interface Game {
  id: number
  title: string
  thumbnail: string
  short_description: string
  genre: string
  platform: string
  game_url: string
}

export interface GameInput {
  title: string
  thumbnail: string
  short_description: string
  genre: string
  platform: string
  game_url: string
}

const GENRE_COLORS: Record<string, string> = {
  MMORPG: '#1f6f5b',
  Shooter: '#7f1d1d',
  Strategy: '#1e3a8a',
  MOBA: '#6d28d9',
  Card: '#92400e',
  'Battle Royale': '#9a3412',
  Sports: '#166534',
  Racing: '#0f766e',
}

function cover(title: string, genre: string): string {
  const color = GENRE_COLORS[genre] ?? '#323238'
  const safeTitle = title.replace(/[&<>"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="46%" fill="#ffffff" font-size="28" font-family="Segoe UI, sans-serif" text-anchor="middle">${safeTitle}</text><text x="50%" y="62%" fill="#d4d4d8" font-size="16" font-family="Segoe UI, sans-serif" text-anchor="middle">${genre}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isHttpUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://')
}

const seed: GameInput[] = [
  {
    title: 'Eldoria Online',
    genre: 'MMORPG',
    platform: 'PC',
    short_description: 'Mundo persistente com clãs, masmorras e comércio entre jogadores.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/eldoria-online',
  },
  {
    title: 'Neon Strike',
    genre: 'Shooter',
    platform: 'PC',
    short_description: 'Tiro tático em arenas neon, com rodadas curtas e ranking semanal.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/neon-strike',
  },
  {
    title: 'Reino de Ferro',
    genre: 'Strategy',
    platform: 'PC',
    short_description: 'Construa fortalezas, gerencie recursos e dispute o mapa em turnos.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/reino-de-ferro',
  },
  {
    title: 'Arena Luminosa',
    genre: 'MOBA',
    platform: 'PC',
    short_description: 'Partidas 5 contra 5 com rotas, objetivos e heróis desbloqueáveis.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/arena-luminosa',
  },
  {
    title: 'Cartas do Abismo',
    genre: 'Card',
    platform: 'Web Browser',
    short_description: 'Duelos de cartas colecionáveis com partidas rápidas direto no navegador.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/cartas-do-abismo',
  },
  {
    title: 'Zona Zero',
    genre: 'Battle Royale',
    platform: 'PC',
    short_description: 'Cem jogadores, zona encolhendo e loot espalhado pela cidade.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/zona-zero',
  },
  {
    title: 'Copa das Ruas',
    genre: 'Sports',
    platform: 'PC',
    short_description: 'Futebol de rua com times personalizados e campeonatos locais.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/copa-das-ruas',
  },
  {
    title: 'Circuito Íon',
    genre: 'Racing',
    platform: 'PC',
    short_description: 'Corridas antigravidade em pistas suspensas e voltas contra o tempo.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/circuito-ion',
  },
  {
    title: 'Crônicas de Aether',
    genre: 'MMORPG',
    platform: 'Web Browser',
    short_description: 'Campanha cooperativa no navegador, com missões diárias e guildas.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/cronicas-de-aether',
  },
  {
    title: 'Sniper Hollow',
    genre: 'Shooter',
    platform: 'PC',
    short_description: 'Missões de precisão em mapas abertos, sem hud poluído.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/sniper-hollow',
  },
  {
    title: 'Império Silencioso',
    genre: 'Strategy',
    platform: 'PC',
    short_description: 'Expanda colônias, pesquise tecnologia e negocie com facções rivais.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/imperio-silencioso',
  },
  {
    title: 'Duelo das Torres',
    genre: 'MOBA',
    platform: 'Web Browser',
    short_description: 'Defenda a torre central e escolha talentos a cada abate.',
    thumbnail: '',
    game_url: 'https://example.com/jogos/duelo-das-torres',
  },
]

let games: Game[] = seed.map((game, index) => ({
  id: index + 1,
  ...game,
  thumbnail: cover(game.title, game.genre),
}))

let nextId = games.length + 1

export function validateGameInput(body: unknown): { value: GameInput } | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Envie um JSON com os dados do jogo.' }
  }

  const data = body as Record<string, unknown>
  const title = readString(data.title)
  const shortDescription = readString(data.short_description)
  const genre = readString(data.genre)
  const platform = readString(data.platform)
  const thumbnail = readString(data.thumbnail)
  const gameUrl = readString(data.game_url)

  if (title.length < 2) {
    return { error: 'Informe um título com pelo menos 2 caracteres.' }
  }
  if (shortDescription.length < 10) {
    return { error: 'Informe uma descrição com pelo menos 10 caracteres.' }
  }
  if (!genre) {
    return { error: 'Informe o gênero.' }
  }
  if (!platform) {
    return { error: 'Informe a plataforma.' }
  }
  if (thumbnail && !isHttpUrl(thumbnail)) {
    return { error: 'A imagem precisa ser uma URL que comece com http:// ou https://.' }
  }
  if (gameUrl && !isHttpUrl(gameUrl)) {
    return { error: 'O link do jogo precisa ser uma URL que comece com http:// ou https://.' }
  }

  return {
    value: {
      title,
      short_description: shortDescription,
      genre,
      platform,
      thumbnail: thumbnail || cover(title, genre),
      game_url: gameUrl,
    },
  }
}

export function listGames(): Game[] {
  return games.map((game) => ({ ...game }))
}

export function getGame(id: number): Game | undefined {
  const game = games.find((item) => item.id === id)
  return game ? { ...game } : undefined
}

export function createGame(input: GameInput): Game {
  const game: Game = { id: nextId, ...input }
  nextId += 1
  games = [...games, game]
  return { ...game }
}

export function updateGame(id: number, input: GameInput): Game | undefined {
  const index = games.findIndex((item) => item.id === id)
  if (index === -1) return undefined

  const updated: Game = { id, ...input }
  games = games.map((item) => (item.id === id ? updated : item))
  return { ...updated }
}

export function deleteGame(id: number): boolean {
  const exists = games.some((item) => item.id === id)
  if (!exists) return false
  games = games.filter((item) => item.id !== id)
  return true
}
