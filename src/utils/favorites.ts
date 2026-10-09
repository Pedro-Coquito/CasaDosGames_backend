const STORAGE_KEY = 'gameFavorites'

export function readFavoriteIds(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is number => typeof id === 'number')
  } catch {
    return []
  }
}

export function writeFavoriteIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function isFavorite(id: number): boolean {
  return readFavoriteIds().includes(id)
}

export function toggleFavoriteId(id: number): boolean {
  const current = readFavoriteIds()
  const exists = current.includes(id)
  const next = exists ? current.filter((item) => item !== id) : [...current, id]
  writeFavoriteIds(next)
  return !exists
}

export function removeFavoriteId(id: number) {
  writeFavoriteIds(readFavoriteIds().filter((item) => item !== id))
}
