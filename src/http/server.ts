import fastify from "fastify"

const app = fastify()

const PORT = 4000

app
  .listen({port: PORT})
  .then(() => {console.log(`Server running on http://localhost:${PORT}`)})