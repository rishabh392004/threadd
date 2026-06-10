import { ApolloServer } from '@apollo/server';
import { User } from "./user/index.js";

async function createApolloGraphqlServer() {
  const server = new ApolloServer({
    typeDefs: `#graphql
      # 1. Add your core object types here (e.g., type User { id: ID! ... })
      ${User.types}

      type Query {
        ${User.queries}
      }
  
      type Mutation {
        ${User.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.Query
      },
      Mutation: {
        ...User.resolvers.Mutation
      }
    },
  });

  return server;
}

export default createApolloGraphqlServer;