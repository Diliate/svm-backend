const prisma = require("../DB/db.config");

// GET: ALL PRODUCTS
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

// GET: FILTERED PRODUCTS (SHOP)
const getFilteredProducts = async (req, res) => {
  const { categoryId, minPrice, maxPrice } = req.query;

  // Build a dynamic where clause based on provided filters
  let where = {};

  if (categoryId) {
    where.categoryId = categoryId;
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

// GET: FEATURED PRODUCTS
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, inStock: true },
      include: { category: true },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch featured products: " + error.message });
  }
};

// POST: ADD PRODUCT
const addProduct = async (req, res) => {
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

  // Get uploaded image paths as an array
  const imageUrls = req.files.map((file) => file.path);

  // Parse other fields
  const parsedPrice = parseFloat(price);
  const precautionsArray = precautions.split(",");

  if (isNaN(parsedPrice)) {
    return res.status(400).json({ message: "Invalid price format" });
  }

  try {
    const existingProduct = await prisma.product.findFirst({
      where: { name, categoryId },
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
        categoryId,
        precautions: precautionsArray,
        punchline,
        quantity,
        dosage,
        imageUrls, // Store multiple image URLs
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product: " + error.message });
  }
};

// DELETE: DELETE PRODUCT
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.delete({
      where: { id },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: UPDATE PRODUCT
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

  // Append new images to existing ones
  const imageUrls = req.files.map((file) => file.path);

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        indications,
        description,
        inStock: inStock === "true",
        categoryId,
        precautions: Array.isArray(precautions)
          ? precautions
          : precautions.split(","),
        punchline,
        quantity,
        dosage,
        imageUrls: { push: imageUrls }, // Append new images to existing ones
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
  getFeaturedProducts,
};
