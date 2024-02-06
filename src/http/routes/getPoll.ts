import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../libs/prisma"

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request, reply) => {
    const reqParams = z.object({
      pollId: z.string().uuid(),
    })
  
    const { pollId } = reqParams.parse(request.params)
  
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
  
    return reply
      .status(200)
      .send({ poll })
  })
}