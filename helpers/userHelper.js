const prisma = require("../DB/db.config");

// Create a new user
const createUser = async (name, email, password = null, phone) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      phone,
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
    include: { addresses: true },
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
  updateUser,
};
