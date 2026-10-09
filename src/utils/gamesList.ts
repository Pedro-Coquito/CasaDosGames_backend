import type { Game } from '../types/game'

export type SortOption = 'title-asc' | 'title-desc' | 'genre'

export function filterAndSortGames(
  games: Game[],
  search: string,
  genre: string,
  sort: SortOption,
): Game[] {
  const term = search.trim().toLowerCase()
  const filtered = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(term)
    const matchesGenre = genre ? game.genre === genre : true
    return matchesSearch && matchesGenre
  })

  const sorted = [...filtered]
  sorted.sort((a, b) => {
    if (sort === 'genre') {
      return a.genre.localeCompare(b.genre, 'pt-BR') || a.title.localeCompare(b.title, 'pt-BR')
    }
    if (sort === 'title-desc') {
      return b.title.localeCompare(a.title, 'pt-BR')
    }
    return a.title.localeCompare(b.title, 'pt-BR')
  })

  return sorted
}

export interface FilterBenchmark {
  items: number
  rounds: number
  beforeMs: number
  afterMs: number
}

/**
 * Compara o custo de filtrar a lista em todo render com o custo de calcular
 * uma vez e reutilizar o resultado enquanto busca, gênero e ordem não mudam.
 * A amostra é ampliada para a medição ficar visível; o catálogo real continua pequeno.
 */
export function measureFilterCost(games: Game[]): FilterBenchmark | undefined {
  if (games.length === 0) return undefined

  const sample: Game[] = Array.from({ length: 4000 }, (_, index) => {
    const game = games[index % games.length]
    return { ...game, id: index + 1, title: `${game.title} ${index}` }
  })
  const rounds = 300

  const beforeStart = performance.now()
  for (let round = 0; round < rounds; round += 1) {
    filterAndSortGames(sample, 'a', '', 'title-asc')
  }
  const beforeMs = performance.now() - beforeStart

  let cached: Game[] | null = null
  let cacheKey = ''
  const afterStart = performance.now()
  for (let round = 0; round < rounds; round += 1) {
    const nextKey = `a||title-asc|${sample.length}`
    if (!cached || cacheKey !== nextKey) {
      cacheKey = nextKey
      cached = filterAndSortGames(sample, 'a', '', 'title-asc')
    }
  }
  const afterMs = performance.now() - afterStart

  const result = {
    items: sample.length,
    rounds,
    beforeMs: Number(beforeMs.toFixed(2)),
    afterMs: Number(afterMs.toFixed(2)),
  }

  console.info(
    `[Casa dos Games][performance] ${result.rounds} filtros em ${result.items} jogos: sem memo ${result.beforeMs} ms, com reutilização do resultado ${result.afterMs} ms.`,
  )

  return result
}
