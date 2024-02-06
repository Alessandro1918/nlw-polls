import fastify from "fastify"
import { createPoll } from "./routes/createPoll"
import { getPoll } from "./routes/getPoll"

const PORT = 4000

const app = fastify()

app.register(createPoll)
app.register(getPoll)

app
  .listen({port: PORT})
  .then(() => {console.log(`Server running on http://localhost:${PORT}`)})