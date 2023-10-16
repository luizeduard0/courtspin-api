const express = require('express')
const routes = express.Router()
const { PrismaClient } = require('@prisma/client')

const authController = require('./controllers/auth.controller')

const prisma = new PrismaClient()

routes.get('/', (req, res) => {
  res.json({})
})

routes.post('/auth/login', authController.login)
routes.post('/auth/signup', authController.signup)

module.exports = routes