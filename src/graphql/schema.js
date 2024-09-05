const typeDefs = `
  type Query {
    say(name: String): String
    products: [Product]
    product(id: Int!): Product
    categories: [Category]
    category(id: Int!): Category
  }

  type Mutation {
    addProduct(name: String!, description: String!, price: Float!, inStock: Boolean!, categoryId: Int!): Product
    updateProduct(id: Int!, name: String, description: String, price: Float, inStock: Boolean, categoryId: Int): Product
    deleteProduct(id: Int!): Boolean
    addCategory(name: String!): Category
    updateCategory(id: Int!, name: String!): Category
    deleteCategory(id: Int!): Boolean
  }

  type Product {
    id: Int
    name: String
    description: String
    price: Float
    inStock: Boolean
    category: Category
  }

  type Category {
    id: Int
    name: String
    products: [Product]
  }
`;

module.exports = { typeDefs };
