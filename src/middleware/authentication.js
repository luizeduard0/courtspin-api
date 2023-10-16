import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client'

dotenv.config()
const prisma = new PrismaClient()

export default async function jwtMiddleware(req, res, next) {
  const auhorizationHeader = req.headers.authorization;

  if (!auhorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access Denied: Invalid Token",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  const userDecoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: userDecoded.id
    }
  })

  if (!user) {
    res.send(401).json({
      error: true,
      message: "Access Denied",
    })
    return
  }

  req.user = user

  next();
}