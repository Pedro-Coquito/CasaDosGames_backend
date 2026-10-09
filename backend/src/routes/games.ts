import type { FastifyPluginAsync } from 'fastify'
import {
  createGame,
  deleteGame,
  getGame,
  listGames,
  updateGame,
  validateGameInput,
} from '../data/games.ts'

function parseId(value: string): number | undefined {
  if (!/^\d+$/.test(value)) return undefined
  const id = Number(value)
  return id > 0 ? id : undefined
}

export const gameRoutes: FastifyPluginAsync = async (app) => {
  app.get('/games', async () => {
    return listGames()
  })

  app.get<{ Params: { id: string } }>('/games/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    if (!id) {
      return reply.status(400).send({ message: 'Identificador inválido.' })
    }

    const game = getGame(id)
    if (!game) {
      return reply.status(404).send({ message: 'Jogo não encontrado.' })
    }

    return game
  })

  app.post('/games', async (request, reply) => {
    const result = validateGameInput(request.body)
    if ('error' in result) {
      return reply.status(400).send({ message: result.error })
    }

    const game = createGame(result.value)
    return reply.status(201).send(game)
  })

  app.put<{ Params: { id: string } }>('/games/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    if (!id) {
      return reply.status(400).send({ message: 'Identificador inválido.' })
    }

    const result = validateGameInput(request.body)
    if ('error' in result) {
      return reply.status(400).send({ message: result.error })
    }

    const game = updateGame(id, result.value)
    if (!game) {
      return reply.status(404).send({ message: 'Jogo não encontrado.' })
    }

    return game
  })

  app.delete<{ Params: { id: string } }>('/games/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    if (!id) {
      return reply.status(400).send({ message: 'Identificador inválido.' })
    }

    const removed = deleteGame(id)
    if (!removed) {
      return reply.status(404).send({ message: 'Jogo não encontrado.' })
    }

    return reply.status(204).send()
  })
}
