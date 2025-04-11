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
import { PrismaClient } from '@/lib/generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 