import fastify from "fastify"
import { createPoll } from "./routes/createPoll"

const PORT = 4000

const app = fastify()

app.register(createPoll)

app
  .listen({port: PORT})
  .then(() => {console.log(`Server running on http://localhost:${PORT}`)})