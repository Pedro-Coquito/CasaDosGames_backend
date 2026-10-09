import cors from '@fastify/cors'
import Fastify from 'fastify'
import { gameRoutes } from './src/routes/games.ts'
import { healthRoutes } from './src/routes/health.ts'

const app = Fastify({ logger: true })
const port = Number(process.env.PORT) || 3333

await app.register(cors, {
  origin(origin, callback) {
    const allowed = !origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    callback(null, allowed)
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

await app.register(healthRoutes)
await app.register(gameRoutes)

try {
  await app.listen({ port, host: '0.0.0.0' })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
