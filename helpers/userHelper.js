// models/userModel.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new user
const createUser = async (name, email, password) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  return user;
};

// Find a user by email
const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

// Find a user by ID
const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

// Update a user by ID
const updateUser = async (id, data) => {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser, // Export the update function
};
