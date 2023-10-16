-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('COACH', 'PROFESSOR', 'PLAYER', 'VIEWER', 'CHAIR_UMPIRE', 'LINE_UMPIRE');

-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('SINGLES', 'DOUBLES');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'REQUEST', 'ACTIVE', 'CANCELED');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('MATCH', 'PRACTICE', 'LESSON');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userTypeId" "UserType" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "avatar" TEXT,
    "location" TEXT NOT NULL,
    "ntrp" DOUBLE PRECISION,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" SERIAL NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "modality" "Modality" NOT NULL,
    "status" "Status" NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionUser" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userType" "UserType" NOT NULL,
    "isWinner" BOOLEAN NOT NULL,

    CONSTRAINT "SessionUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionScore" (
    "id" SERIAL NOT NULL,
    "sessionsId" INTEGER NOT NULL,
    "nSets" INTEGER NOT NULL,
    "nGames" INTEGER NOT NULL,
    "winnerScore" INTEGER NOT NULL,
    "loserScore" INTEGER NOT NULL,

    CONSTRAINT "SessionScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SessionUser" ADD CONSTRAINT "SessionUser_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionUser" ADD CONSTRAINT "SessionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionScore" ADD CONSTRAINT "SessionScore_sessionsId_fkey" FOREIGN KEY ("sessionsId") REFERENCES "Sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
