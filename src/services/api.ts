import { API_URL } from '../constants/catalog'
import type { Game, GameInput } from '../types/game'

interface ApiErrorBody {
  message?: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response

  const headers: HeadersInit = {
    ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
    ...options?.headers,
  }

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Não foi possível conectar à API. Confira se o Fastify está rodando na porta 3333.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody

  if (!response.ok) {
    throw new Error(data.message || 'A API recusou a operação.')
  }

  return data
}

export function fetchGames(): Promise<Game[]> {
  return request<Game[]>('/games')
}

export function fetchGame(id: number): Promise<Game> {
  return request<Game>(`/games/${id}`)
}

export function createGame(input: GameInput): Promise<Game> {
  return request<Game>('/games', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateGame(id: number, input: GameInput): Promise<Game> {
  return request<Game>(`/games/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteGame(id: number): Promise<void> {
  return request<void>(`/games/${id}`, { method: 'DELETE' })
}
