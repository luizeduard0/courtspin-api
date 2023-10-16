const asyncHandler = require("express-async-handler");
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./../constants')
const { z } = require('zod')

const prisma = new PrismaClient()

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (bcrypt.compare(password, user.password)) {
    const { password, ...usr } = user

    const token = jwt.sign({
      id: usr.id,
      email: usr.email
    }, JWT_SECRET)

    res.json({
      token,
      ...usr
    })
    return
  }
  res.status(401).json({
    error: 'Invalid username or password'
  })
})

exports.signup = asyncHandler(async (req, res) => {
  const payload = req.body

  try {
    const UserInfo = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
      password: z.string(),
      password_confirmation: z.string(),
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

  const {password_confirmation, ...data} = payload

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      ...data,
      userTypeId: 'PLAYER',
      password: hashedPassword
    }
  })

  res.status(200).json({
    id: user.id
  })
})