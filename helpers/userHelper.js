const prisma = require("../DB/db.config");

// Create a new user
const createUser = async (name, email, hashedPassword, isAdmin = false) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isAdmin,
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

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
