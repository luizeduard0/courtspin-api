import asyncHandler from "express-async-handler"
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";
dotenv.config()

const prisma = new PrismaClient()

export const getProfile = asyncHandler(async (req, res) => {
  let { id: userId } = req.params

  if (userId === 'me') {
    userId = req.user.id
  } else {
    userId = parseInt(userId)
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      gender: true,
      ntrp: true,
      location: true,
      avatar: true,
    },
    where: {
      id: userId
    }
  })

  if (!user) {
    res.status(404).json()
    return
  }

  res.json(user)
})

export default {
  getProfile
}