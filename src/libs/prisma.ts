import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()
// export const prisma = new PrismaClient({log: ["query"]})   //logs every sql query on the terminal
