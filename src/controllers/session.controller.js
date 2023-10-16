import asyncHandler from "express-async-handler"
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
const prisma = new PrismaClient()

const loadSession = asyncHandler(async (req, res) => {
  const { id } = req.params

  const session = await prisma.sessions.findUnique({
    include: {
      sessionUser: {
        select: {
          isWinner: true,
          userType: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              ntrp: true
            }
          }
        }
      }
    },
    where: {
      id: parseInt(id)
    }
  })

  if(!session) {
    res.status(404).json()
    return
  }

  res.json(session)

})

const addSession = asyncHandler(async (req, res) => {
  const payload = req.body

  try {
    z.object({
      type: z.string(),
      modality: z.string(),
    })
  } catch (e) {
    res.status(422).json({
      code: e.code,
      error: e.message
    })
    return
  }

  const { step, type, info, ...data } = payload

  const session = await prisma.sessions.create({
    data: {
      ...data,
      sessionType: type,
      status: 'REQUEST',

    }
  })

  const sessionUser = await prisma.sessionUser.create({
    data: {
      userId: req.user.id,
      sessionId: session.id,
      userType: 'PLAYER',
      isWinner: false,
    }
  })

  res.status(200).json(session)
})

export default {
  loadSession,
  addSession
}