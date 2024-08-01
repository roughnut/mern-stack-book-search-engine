const express = require("express");
// import Apollo server
const { ApolloServer } = require("@apollo/server");
// import Apollo server middleware
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
// import JWT auth middleware
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Create a new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  // Start the Apollo Server
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Apply graphql middleware to express server
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Catch-all route to serve index.html for any unmatched routes - anything other than index.html 🤣
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the Express server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the function to start the server
startApolloServer();