const express = require('express');
const mongoose = require('mongoose');
const dotend = require('dotenv');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const { ApolloServer } = require('apollo-server-express');

dotend.config();

const app = express()
const port = process.env.PORT || 3000

const typeDefs = fs.readFileSync('./graphql/schema.graphql',{encoding:'utf-8'})
const resolvers = require('./graphql/resolvers');
const { verifySupabaseJWT } = require('./utils/verifyToken');

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "idea-validation-app"
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB error:", err);
  }
}

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let user = null;
      const authHeader = req.headers.authorization || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
          const payload = await verifySupabaseJWT(token);

          user = {
            email: payload.email,
            sub: payload.sub,
            role: payload.role || 'user'
          };

        } catch (err) {
          console.warn("Invalid JWT token:", err.message);
        }
      }

      return { user };
    }
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql', cors: true });

  app.listen(port, () => console.log(`Server started on http://localhost:${port}/graphql`));

}

(async () => {
  await connectDatabase();
  await startServer();
})();