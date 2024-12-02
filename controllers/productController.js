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
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: FILTERED PRODUCTS (SHOP)
const getFilteredProducts = async (req, res) => {
  const { categoryId, minPrice, maxPrice } = req.query;

  let where = {};

  if (categoryId) {
    const categoryIds = categoryId.split(",");
    where.categoryId = { in: categoryIds };
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
    res.status(200).json(products);
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
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured products." });
  }
};

// GET: LIMITED OFFER PRODUCTS
const getLimitedOfferProducts = async (req, res) => {
  try {
    const currentDateTime = new Date();
    const products = await prisma.product.findMany({
      where: {
        limitedOffer: true,
        discountExpiry: { gte: currentDateTime },
        inStock: true,
      },
      include: { category: true },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No limited offer products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch limited offer products." });
  }
};

// GET: DISCOUNTED PRODUCTS
const getDiscountedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        discount: { gt: 0 },
        inStock: true,
      },
      include: { category: true },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No discounted products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch discounted products." });
  }
};

// GET: PRODUCT DETAILS USING ID WITH FAVOURITE STATUS
const getProductById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query; // Capture userId from query params

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let isFavourite = false;
    if (userId) {
      const wishlistItem = await prisma.wishlistItem.findFirst({
        where: { productId: id, wishlist: { userId: parseInt(userId, 10) } },
      });
      isFavourite = !!wishlistItem;
    }

    res.status(200).json({ ...product, favourite: isFavourite });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product details." });
  }
};

// GET: SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query string is required" });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to search products." });
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
    featured,
    limitedOffer,
    discount,
    discountExpiry,
  } = req.body;

  const imageUrls = req.files.map((file) => file.path);

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        indications,
        description,
        inStock: inStock === "true",
        categoryId,
        precautions: precautions.split(","),
        punchline,
        quantity,
        dosage,
        imageUrls,
        featured: featured === "true",
        limitedOffer: limitedOffer === "true",
        discount: discount ? parseFloat(discount) : 0,
        discountExpiry: discountExpiry ? new Date(discountExpiry) : null,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product." });
  }
};

// DELETE: DELETE PRODUCT
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.delete({ where: { id } });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product." });
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
    featured,
    limitedOffer,
    discount,
    discountExpiry,
  } = req.body;

  const imageUrls = req.files?.map((file) => file.path) || [];

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
        precautions: precautions.split(","),
        punchline,
        quantity,
        dosage,
        imageUrls: imageUrls.length > 0 ? { push: imageUrls } : undefined,
        featured: featured === "true",
        limitedOffer: limitedOffer === "true",
        discount: discount ? parseFloat(discount) : 0,
        discountExpiry: discountExpiry ? new Date(discountExpiry) : null,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product." });
  }
};

module.exports = {
  getAllProducts,
  getFilteredProducts,
  getFeaturedProducts,
  getLimitedOfferProducts,
  getDiscountedProducts,
  getProductById,
  searchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
};
