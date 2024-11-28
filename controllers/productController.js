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

  // Handle multiple categories filtering
  if (categoryId) {
    const categoryIds = categoryId.split(","); // Assume categoryId is a comma-separated string
    where.categoryId = { in: categoryIds };
  }

  // Handle price range filtering
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

// GET: GET LIMITED OFFER PRODUCTS
const getLimitedOfferProducts = async (req, res) => {
  try {
    const currentDateTime = new Date();
    const products = await prisma.product.findMany({
      where: {
        limitedOffer: true,
        discountExpiry: { gte: currentDateTime }, // Ensure the discount is valid
        inStock: true,
      },
      include: { category: true },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No limited offer products found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch limited offer products: " + error.message,
    });
  }
};

// GET: DISCOUNTED PRODUCTS
const getDiscountedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        discount: { gt: 0 }, // Products with a discount greater than 0
        inStock: true,
      },
      include: { category: true },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No discounted products found" });
    }

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch discounted products: " + error.message });
  }
};

// GET: PRODUCT DETAILS USING ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch product: " + error.message });
  }
};

// GET: SEARCH PRODUCTS
const searchProducts = async (req, res) => {
  const { query } = req.query; // Capture the query string from the request

  console.log("Search Query Received:", query); // Log incoming query

  if (!query) {
    return res.status(400).json({ message: "Query string is required" });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query, // Partial match for the product name
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    console.log("Products Found:", products); // Log found products

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error.message);
    res.status(500).json({ error: "Internal server error" });
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
    featured, // New field
    limitedOffer, // New field
    discount, // New field
    discountExpiry, // New field
  } = req.body;

  // Get uploaded image paths as an array
  const imageUrls = req.files.map((file) => file.path);

  // Parse numerical fields
  const parsedPrice = parseFloat(price);
  const parsedDiscount = discount ? parseFloat(discount) : 0; // Default to 0 if no discount provided
  const parsedDiscountExpiry = discountExpiry ? new Date(discountExpiry) : null; // Default to null if not provided

  // Validate price format
  if (isNaN(parsedPrice)) {
    return res.status(400).json({ message: "Invalid price format" });
  }

  // Validate discount format (if provided)
  if (discount && isNaN(parsedDiscount)) {
    return res.status(400).json({ message: "Invalid discount format" });
  }

  // Split precautions into an array
  const precautionsArray = precautions ? precautions.split(",") : [];

  try {
    // Check if the product already exists in the same category
    const existingProduct = await prisma.product.findFirst({
      where: { name, categoryId },
    });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists" });
    }

    // Create a new product
    const product = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        indications,
        description,
        inStock: inStock === "true", // Convert string to boolean
        categoryId,
        precautions: precautionsArray,
        punchline,
        quantity,
        dosage,
        imageUrls, // Store multiple image URLs
        featured: featured === "true", // Convert string to boolean
        limitedOffer: limitedOffer === "true", // Convert string to boolean
        discount: parsedDiscount, // Parsed discount value
        discountExpiry: parsedDiscountExpiry, // Parsed discount expiry
      },
    });

    res.status(201).json(product);
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
    featured,
    limitedOffer,
    discount,
    discountExpiry,
  } = req.body;

  // Parse precautions to array
  const parsedPrecautions = Array.isArray(precautions)
    ? precautions
    : precautions.split(",").map((item) => item.trim());

  // Parse imageUrls from uploaded files
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
        precautions: parsedPrecautions,
        punchline,
        quantity,
        dosage,
        imageUrls: imageUrls.length > 0 ? { push: imageUrls } : undefined,
        featured: featured === "true",
        limitedOffer: limitedOffer === "true",
        discount: discount ? parseFloat(discount) : 0,
        // Only set discountExpiry if it's valid
        discountExpiry:
          discountExpiry && !isNaN(new Date(discountExpiry))
            ? new Date(discountExpiry)
            : null,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ error: `Failed to update product: ${error.message}` });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getFilteredProducts,
  getFeaturedProducts,
  getLimitedOfferProducts,
  getDiscountedProducts,
  searchProducts,
  getProductById,
};
