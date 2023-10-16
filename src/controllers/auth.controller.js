import asyncHandler from "express-async-handler"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import dotenv from "dotenv";
dotenv.config()

const prisma = new PrismaClient()

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(!user) {
    res.status(404).json({
      code: 404,
      msg: 'Invalid email or password'
    })
    return
  }

  if (bcrypt.compare(password, user.password)) {
    const { password, ...usr } = user

    const token = await jwt.sign({
      id: usr.id,
      email: usr.email
    }, process.env.JWT_SECRET)

    res.json({
      token,
      ...usr
    })
    return
  }
  res.status(401).json({
    error: 'Invalid email or password'
  })
})

const signup = asyncHandler(async (req, res) => {
  const payload = req.body

  try {
    const UserInfo = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
      password: z.string(),
      password_confirmation: z.string(),
      ntrp: z.string()
    })
  } catch (e) {
    res.status(422).json({
      code: e.code,
      error: e.message
    })
    return
  }

  if (payload.password !== payload.password_confirmation) {
    res.status(422).json({
      code: 422,
      error: 'Password does not match'
    })
    return
  }

  const {password_confirmation, ntrp, ...data} = payload

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      ...data,
      userTypeId: 'PLAYER',
      password: hashedPassword,
      ntrp: parseFloat(ntrp)
    }
  })

  res.status(200).json({
    id: user.id
  })
})

export default {
  login,
  signup
}