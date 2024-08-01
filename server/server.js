const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
// import authMiddleware to handle JWT authentication
const { authMiddleware } = require("./utils/auth");
// import GraphQL typedefs and resolvers that define schema and queries/mutations for ApolloServer
const { typeDefs, resolvers } = require("./schemas");

const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();
// set up ApolloServer with GraphQL schema and JWT authentication context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Add a catch-all route to serve index.html for any unmatched routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

const startApolloServer = async () => {
  // start the server
  await server.start();
  // connect ApolloServer to the Express app. 
  // the applyMiddleware method includes a /graphql endpoint
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // server.graphqlPath is the default endpoint /graphql from .applyMiddleware
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer();