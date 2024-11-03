const prisma = require("../DB/db.config");

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category Already Exists" });
    }

    const category = await prisma.category.create({
      data: { name },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!categoryExists) {
      return res.status(404).json({ message: "Category does not exist" });
    }

    const category = await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!categoryExists) {
      return res.status(404).json({ message: "Category does not exist" });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
};
