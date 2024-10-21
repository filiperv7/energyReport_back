import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastify, { FastifyInstance } from 'fastify'
import 'reflect-metadata'
import { registerRoutes } from './Routes'

const app: FastifyInstance = fastify()
app.register(fastifyMultipart)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

registerRoutes(app)

app.listen(
  {
    port: Number(process.env.PORT) || 3100
  },
  () => console.log(`Server is running on port ${process.env.PORT || 3100}`)
)
