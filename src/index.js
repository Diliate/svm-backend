const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const { typeDefs } = require("./graphql/schema");
const { resolvers } = require("./graphql/resolvers");
const { contextMiddleware } = require("./middleware/context"); 
const prisma = require("./db/db.config");

// Function to initialize the server
async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  // Enable CORS for all routes
  app.use(cors());

  // Middleware to parse JSON requests
  app.use(express.json());

  // Create GraphQL server instance with ApolloServer
  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  try {
    // Start the Apollo server
    await gqlServer.start();

    // Root route for health check
    app.get("/", (req, res) => {
      res.json({
        message: "Server is up and running",
      });
    });

    // Apply GraphQL middleware with the context
    app.use(
      "/graphql",
      expressMiddleware(gqlServer, {
        context: contextMiddleware,
      })
    );

    // Start listening for requests on the specified port
    app.listen(PORT, () => {
      console.log(`🚀 Server started at PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing Apollo Server:", error.message);
    process.exit(1); // Exit the process if the server fails to start
  }
}

// Initialize the server
init().catch((error) => {
  console.error("Error starting the server:", error);
});
