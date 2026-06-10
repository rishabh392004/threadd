import { startStandaloneServer } from '@apollo/server/standalone';
import createApolloGraphqlServer from "./graphql/index.js"; // Ensure default import name match

const PORT = Number(process.env.PORT) || 8000;

// 1. Initialize the Apollo Server instance
const server = await createApolloGraphqlServer();

// 2. Start the Standalone Server on your specified port
const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log(` Standalone Apollo Server ready at: ${url}`);