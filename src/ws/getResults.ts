import { FastifyInstance } from "fastify"
import { z } from "zod"
import { voting } from "../utils/vote-pub-sub"

export async function getResults(app: FastifyInstance) {
  app.get("/polls/:pollId/results", { websocket: true }, (connection, request) => {
    // connection.socket.on("message", (message: string) => {
    //   connection.socket.send(`You sent: ${message}`)
    // })

    //Pub/Sub pattern:
    //Subscribe this connection (this user) to this channel (messages of this pollId).
    //Other function ("/vote") will publish a message to this channel.

    const reqParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = reqParams.parse(request.params)

    //Second param of the "subscribe" method: function named "subscribe" with 1 param: "message"
    voting.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}