const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());

  // Create Graphql server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
      hello: String
      say(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there, I am a graphql server`,
        say: (_, { name }) => `Hey ${name}, How are you ?`,
      },
    },
  });

  // Start the gql server
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({
      message: "Server is up and running",
    });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();
