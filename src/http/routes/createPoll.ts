import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../libs/prisma"

export async function createPoll(app: FastifyInstance) {
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
}