import express from "express"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { prisma } from "./lib/db.js"

const app = express();

const server = new ApolloServer({
  // 1. Added the missing "User" type definition here
  typeDefs: `#graphql
    type User {
      id: ID
      firstName: String!
      lastName: String!
      email: String!
    }

    type Query {
      hello: String
      say(name: String!): String
    }

    # 2. Changed 'firstname' to 'firstName' (camelCase) to match your resolver
    type Mutation {
      createUser(firstName: String!, lastName: String!, email: String!, password: String!): User
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello world!",
      say: (_, { name }) => `Hello ${name}, How are you`
    },
    Mutation: {
      // 3. Destructured with matching camelCase names
      createUser: async (_, { firstName, lastName, email, password }:
        { firstName: string, lastName: string, email: string, password: string }) => {
        
        // 4. Capture the created user database record
        const newUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password,
            salt: "random_salt_value",
          }
        });

        // 5. Return the record directly so it populates properly in GraphQL
        return newUser;
      }
    }
  },
});

const PORT = Number(process.env.PORT) || 8000;

app.get('/', (req, res) => {
  res.json({ message: "Server is Running" })
})

// Start GraphQL standalone server
const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});