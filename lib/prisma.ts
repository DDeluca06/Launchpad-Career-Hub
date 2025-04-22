// This is a singleton pattern to prevent multiple instances of Prisma Client
// This is particularly important in development mode where Next.js hot reloading
// can create multiple instances, leading to connection pool exhaustion and
// performance issues.
// 
// For more details, see:
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
// 
// What does this mean for you, the developer?
// You should be using this file to import Prisma Client
// and not creating your own instance of it.
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with error logging
const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: ['error', 'warn'],
    })
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()
console.log('Prisma client initialized:', prisma)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
