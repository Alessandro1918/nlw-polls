import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../libs/prisma"
import { redis } from "../../libs/redis"

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

    if (!poll) {
      return reply
        .status(400)
        .send({ "message": "Poll not found" })
    }

    const redisResult = await redis.zrange(pollId, 0, -1, "WITHSCORES")
    // console.log(redisResult)          //['74e063a3...', '0', '64c33bfd...', '1']

    //V1: use redisResult.indexOf
    //V2: convert array to other structure, like an object, running a fnction to every array item (here named "line")
    const votes = redisResult.reduce((obj, line, index) => {
      //"even" index, element is an ID :
      if (index % 2 === 0) {
        const score = redisResult[index + 1]
        Object.assign(obj, { [line]: Number(score) })
      }
      return obj
    }, {} as Record<string, number>)  //obj of tipe "Record", list of string/number
    // console.log(votes)                //{'74e063a3...', '0', '64c33bfd...', '1'}

    const formattedPool = {
      id: poll.id,
      title: poll.title,
      options: poll.options.map(option => {
        return {
          id: option.id,
          title: option.title,
          //V1:
          // score: redisResult.includes(option.id)
          //   ? Number(redisResult[redisResult.indexOf(option.id) + 1] )
          //   : 0,
          //V2:
          score: (option.id in votes) 
            ? votes[option.id] 
            : 0,
        };
      })
    }

    return reply
      .status(200)
      .send({ formattedPool })
  })
}