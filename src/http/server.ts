import "dotenv/config"
import fastify from "fastify"
import cookie from "@fastify/cookie"
import websocket from "@fastify/websocket"
import { createPoll } from "./routes/createPoll"
import { getPoll } from "./routes/getPoll"
import { voteOnPoll } from "./routes/voteOnPoll"
import { getResults } from "../ws/getResults"

const PORT = Number(process.env.PORT) || 4000

const app = fastify()

//use cookies
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest"
})

//use websockets
app.register(websocket)

//routes
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(getResults)

app
  .listen({port: PORT})
  .then(() => {console.log(`Server running on http://localhost:${PORT}`)})