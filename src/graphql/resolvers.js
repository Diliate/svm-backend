const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
    product: async (_, { id }) =>
      await prisma.product.findUnique({ where: { id } }),
    categories: async () => await prisma.category.findMany(),
    category: async (_, { id }) =>
      await prisma.category.findUnique({ where: { id } }),
  },
  Mutation: {
    addProduct: async (
      _,
      { name, description, price, inStock, categoryId, image }
    ) => {
      return await prisma.product.create({
        data: {
          name,
          description,
          price,
          inStock,
          category: { connect: { id: categoryId } },
          image, // Optional field
        },
      });
    },
    updateProduct: async (
      _,
      { id, name, description, price, inStock, categoryId, image }
    ) => {
      return await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          inStock,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          image, // Optional field
        },
      });
    },
    deleteProduct: async (_, { id }) => {
      try {
        await prisma.product.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },
    addCategory: async (_, { name, image }) => {
      return await prisma.category.create({
        data: {
          name,
          image, // Optional field
        },
      });
    },
    updateCategory: async (_, { id, name, image }) => {
      return await prisma.category.update({
        where: { id },
        data: {
          name,
          image, // Optional field
        },
      });
    },
    deleteCategory: async (_, { id }) => {
      try {
        await prisma.category.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },
  },
  Product: {
    category: async (parent) => {
      return await prisma.category.findUnique({
        where: { id: parent.categoryId },
      });
    },
  },
  Category: {
    products: async (parent) => {
      return await prisma.product.findMany({
        where: { categoryId: parent.id },
      });
    },
  },
};

module.exports = { resolvers };
