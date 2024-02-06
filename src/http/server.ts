import "dotenv/config"
import fastify from "fastify"
import cookie from "@fastify/cookie"
import { createPoll } from "./routes/createPoll"
import { getPoll } from "./routes/getPoll"
import { voteOnPoll } from "./routes/voteOnPoll"

const PORT = Number(process.env.PORT) || 4000

const app = fastify()

app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest"
})

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app
  .listen({port: PORT})
  .then(() => {console.log(`Server running on http://localhost:${PORT}`)})