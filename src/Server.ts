import fastifyMultipart from '@fastify/multipart'
import fastify, { FastifyInstance } from 'fastify'
import 'reflect-metadata'
import { registerRoutes } from './Routes'

const app: FastifyInstance = fastify()
app.register(fastifyMultipart)

registerRoutes(app)

app.listen(
  {
    port: 3100
  },
  () => console.log('Server is running on port 3100')
)
