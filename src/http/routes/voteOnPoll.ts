import { FastifyInstance } from "fastify"
import { z } from "zod"
import { randomUUID } from "node:crypto"
import { prisma } from "../../libs/prisma"

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {

    const reqParams = z.object({
      pollId: z.string().uuid(),
    })

    const reqBody = z.object({
      pollOptionId: z.string().uuid(),
    })
  
    const { pollId } = reqParams.parse(request.params)
    const { pollOptionId } = reqBody.parse(request.body)

    let { sessionId } = request.cookies

    //request with cookie: user already voted on some poll
    if (sessionId) {

      //get this user's votes for this poll (should return 1 or 0, true or false)
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          }
        }
      })

      //vote is for this poll, 
      if (userPreviousVoteOnPoll) {
        
        //but to a different option
        if (userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
          await prisma.vote.delete({
            where: {
              id: userPreviousVoteOnPoll.id,
            }
          })
        }

        //same option
        else {
          return reply
            .status(400)
            .send({ message: 'You have already voted for this option' })
        }
      } 
    }

    //request without cookie: user is casting first vote on first poll
    else {
      sessionId = randomUUID()
      reply
        .setCookie(
          "sessionId", 
          sessionId, 
          { 
            path: "/", 
            maxAge: 60 * 60 * 24 * 30,    //60s * 60min/h * 24h/d * 30d/mo = 30 days
            signed: true,
            httpOnly: true
          }
        )
    }

    // console.log(sessionId)    //9exxx25.CnqoENxxxfdfvsft (sessionId.signature)

    //TODO - Bug
    //Upon first request, sessionId = randomUUID()
    //On subsequent requests, sessionId = randomUUID() + cookie signature
   
    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    return reply
      .status(201)
      .send()
  })
}