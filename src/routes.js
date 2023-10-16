import express from 'express'
import { PrismaClient } from '@prisma/client'

import authController from './controllers/auth.controller.js'
import sessionController from './controllers/session.controller.js'
import jwtMiddleware from './middleware/authentication.js'

const routes = express.Router()
const prisma = new PrismaClient()

routes.get('/', (req, res) => {
  res.json({})
})

routes.post('/auth/login', authController.login)
routes.post('/auth/signup', authController.signup)

routes.get('/sessions/:id', jwtMiddleware, sessionController.loadSession)
routes.post('/sessions', jwtMiddleware, sessionController.addSession)

export default routes