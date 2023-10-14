const express = require('express')
const routes = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

routes.get('/', (req, res) => {
  res.json({ 'Hello': 'World' })
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