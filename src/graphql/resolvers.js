const { PrismaClient } = require("@prisma/client");
const { authenticate, authorize } = require('../db/db.config.js'); 

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    products: async (_, args, context) => {
      try {
        authenticate(context.req); // Ensure user is authenticated
        const products = await prisma.product.findMany();
        return products;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Unable to fetch products");
      }
    },
    product: async (_, { id }, context) => {
      try {
        authenticate(context.req); // Ensure user is authenticated
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) throw new Error("Product not found");
        return product;
      } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error("Unable to fetch product");
      }
    },
    categories: async (_, args, context) => {
      try {
        authenticate(context.req); // Ensure user is authenticated
        const categories = await prisma.category.findMany();
        return categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Unable to fetch categories");
      }
    },
    category: async (_, { id }, context) => {
      try {
        authenticate(context.req); // Ensure user is authenticated
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) throw new Error("Category not found");
        return category;
      } catch (error) {
        console.error("Error fetching category:", error);
        throw new Error("Unable to fetch category");
      }
    },
  },

  Mutation: {
    addProduct: async (_, { name, description, price, inStock, categoryId, image }, context) => {
      try {
        authenticate(context.req); // Authenticate user
        authorize(['ADMIN', 'BUSINESS_OWNER'])(context.req); // Only admin/business owner

        const product = await prisma.product.create({
          data: {
            name,
            description,
            price,
            inStock,
            category: { connect: { id: categoryId } },
            image, // Optional field
          },
        });
        return product;
      } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Unable to add product");
      }
    },
    updateProduct: async (_, { id, name, description, price, inStock, categoryId, image }, context) => {
      try {
        authenticate(context.req); // Authenticate user
        authorize(['ADMIN', 'BUSINESS_OWNER'])(context.req); // Only admin/business owner

        const product = await prisma.product.update({
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
        return product;
      } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Unable to update product");
      }
    },
    deleteProduct: async (_, { id }, context) => {
      try {
        authenticate(context.req); // Authenticate user
        authorize(['ADMIN'])(context.req); // Only admin

        await prisma.product.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        return false;
      }
    },
    addCategory: async (_, { name, image }, context) => {
      try {
        authenticate(context.req); // Authenticate user
        authorize(['ADMIN'])(context.req); // Only admin

        const category = await prisma.category.create({
          data: { name, image },
        });
        return category;
      } catch (error) {
        console.error("Error adding category:", error);
        throw new Error("Unable to add category");
      }
    },
    updateCategory: async (_, { id, name, image }, context) => {
      try {
        authenticate(context.req); // Authenticate user
        authorize(['ADMIN'])(context.req); // Only admin

        const category = await prisma.category.update({
          where: { id },
          data: { name, image },
        });
        return category;
      } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Unable to update category");
      }
    },
    deleteCategory: async (_, { id }, context) => {
      try {
        authenticate(context.req); // Authenticate user
        authorize(['ADMIN'])(context.req); // Only admin

        await prisma.category.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("Error deleting category:", error);
        return false;
      }
    },
  },

  Product: {
    category: async (parent) => {
      try {
        return await prisma.category.findUnique({
          where: { id: parent.categoryId },
        });
      } catch (error) {
        console.error("Error fetching category for product:", error);
        throw new Error("Unable to fetch category");
      }
    },
  },

  Category: {
    products: async (parent) => {
      try {
        return await prisma.product.findMany({
          where: { categoryId: parent.id },
        });
      } catch (error) {
        console.error("Error fetching products for category:", error);
        throw new Error("Unable to fetch products for category");
      }
    },
  },
};

module.exports = { resolvers };
