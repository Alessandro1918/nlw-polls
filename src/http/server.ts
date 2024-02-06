import fastify from "fastify"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const PORT = 4000

const app = fastify()

const prisma = new PrismaClient()

app.post("/polls", async (request, reply) => {
  const reqBody = z.object({
    title: z.string(),
  })

  const { title } = reqBody.parse(request.body)

  const poll = await prisma.poll.create({
    data: {
      title,
    }
  })

  return reply
    .status(201)
    .send({ pollId: poll.id })
})

app
  .listen({port: PORT})
  .then(() => {console.log(`Server running on http://localhost:${PORT}`)})