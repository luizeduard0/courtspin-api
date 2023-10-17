import express from 'express'
import { PrismaClient } from '@prisma/client'

import jwtMiddleware from './middleware/authentication.js'

import authController from './controllers/auth.controller.js'
import sessionController from './controllers/session.controller.js'
import userController from './controllers/user.controller.js'

const routes = express.Router()
const prisma = new PrismaClient()

routes.get('/', (req, res) => {
  res.json({})
})

routes.post('/auth/login', authController.login)
routes.post('/auth/signup', authController.signup)

routes.get('/inbox', sessionController.inbox)
routes.get('/sessions/:id', jwtMiddleware, sessionController.loadSession)
routes.post('/sessions/:id/join', jwtMiddleware, sessionController.joinSession)
routes.post('/sessions', jwtMiddleware, sessionController.addSession)

routes.get('/user/profile/:id', jwtMiddleware, userController.getProfile)

export default routes