import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../libs/prisma"

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, reply) => {
    const reqBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    })
  
    const { title, options } = reqBody.parse(request.body)
  
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map(option => {
              return { title: option }
            })
          }
        }
      }
    })
  
    return reply
      .status(201)
      .send({ pollId: poll.id })
  })
}