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

  await prisma.sessionUser.create({
    data: {
      userId: req.user.id,
      sessionId: session.id,
      userType: 'PLAYER',
      isWinner: false,
    }
  })

  res.status(200).json(session)
})

const joinSession = asyncHandler(async(req, res) => {
  const payload = req.params

  try {
    z.object({
      id: z.string(),
    })
  } catch (e) {
    res.status(422).json({
      code: e.code,
      error: e.message
    })
    return
  }

  const existingSessionUsers = await prisma.sessionUser.findMany({
    where: {
      sessionId: parseInt(payload.id)
    }
  })

  const hasJoined = existingSessionUsers.find(u => u.id === req.user.id)

  if(hasJoined) {
    res.status(422).json({
      code: 422,
      error: "You're already part of this session"
    })
    return
  }

  const sessionUser = await prisma.sessionUser.create({
    data: {
      sessionId: parseInt(payload.id),
      userId: req.user.id,
      isWinner: false,
      userType: 'PLAYER'
    }
  })

  if(sessionUser) {
    res.json({
      id: sessionUser.id
    })
  } else {
    res.status(422).json({
      code: 422,
      error: 'Something went wrong, please try again.'
    })
  }
})

export const inbox = asyncHandler(async(req, res) => {
  const itemsPerPage = 15
  const page = req.params?.p || 0

  const sessions = await prisma.sessions.findMany({
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
    orderBy: {
      id: 'desc'
    },
    skip: page,
    take: 15
  })

  res.json(sessions)
})

export default {
  loadSession,
  addSession,
  joinSession,
  inbox
}