const prisma = require("../DB/db.config");

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilteredProducts = async (req, res) => {
  const { categoryId, minPrice, maxPrice } = req.query;

  // Build a dynamic where clause based on provided filters
  let where = {};

  if (categoryId) {
    where.categoryId = parseInt(categoryId);
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  const {
    name,
    price,
    indications,
    description,
    inStock,
    categoryId, // UUID format
    precautions, // This comes as a comma-separated string
    punchline,
    quantity,
    dosage,
  } = req.body;
  const imageUrl = req.file ? req.file.path : ""; // Handling the uploaded image

  // Convert price to a float, as categoryId is now a UUID (string)
  const parsedPrice = parseFloat(price);

  // Convert precautions string to an array by splitting the string by commas
  const precautionsArray = precautions.split(",");

  // Validate price format only
  if (isNaN(parsedPrice)) {
    return res.status(400).json({ message: "Invalid price format" });
  }

  try {
    const existingProduct = await prisma.product.findFirst({
      where: {
        name,
        categoryId, // UUID is already a string, so no parsing needed
      },
    });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        indications,
        description,
        inStock: inStock === "true",
        categoryId, // Directly use the UUID string
        precautions: precautionsArray,
        punchline,
        quantity,
        dosage,
        imageUrl,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product: " + error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.delete({
      where: { id }, // Pass id as a string, no need to parse
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    indications,
    description,
    inStock,
    categoryId,
    precautions,
    punchline,
    quantity,
    dosage,
  } = req.body;
  const imageUrl = req.file ? req.file.path : ""; // Handling the uploaded image

  try {
    const product = await prisma.product.update({
      where: { id }, // Use id directly as a String
      data: {
        name,
        price: parseFloat(price), // Convert price to a float
        indications,
        description,
        inStock: inStock === "true", // Convert inStock to a boolean
        categoryId,
        precautions: Array.isArray(precautions)
          ? precautions
          : precautions.split(","), // Ensure precautions is an array
        punchline,
        quantity,
        dosage,
        imageUrl,
      },
    });
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update product: " + error.message });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getFilteredProducts,
};
