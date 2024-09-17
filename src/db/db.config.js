const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'], 
});

// Optional: Middleware to log queries for debugging 
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});

// Graceful shutdown handling to prevent open connections in certain environments
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
