const express = require('express')
const routes = express.Router()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants')

const prisma = new PrismaClient()

routes.get('/', (req, res) => {
  res.json({ 'Hello': 'World' })
})

routes.post('/auth/login', async (req, res) => {
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

routes.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      userTypeId: true,
      firstName: true,
      lastName: true,
      gender: true,
      zipcode: true,
      ntrp: true
    }
  })
  res.json(users)
})

module.exports = routes