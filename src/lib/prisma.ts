import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type GlobalWithPrisma = typeof globalThis & {
  prisma: undefined | ReturnType<typeof prismaClientSingleton>;
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = (globalThis as GlobalWithPrisma).prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  (globalThis as GlobalWithPrisma).prisma = prisma;
}

export { prisma }; 