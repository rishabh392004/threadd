import express from "express"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const app=express();
const server = new ApolloServer({
    //typedef pe hm schema dete haiii
  typeDefs: `#graphql
    type Query {
      hello: String
      say(name: String!): String
    }
type Mutation{
createUser
}
  `,//schema
  resolvers: {
    Query: {
      hello: () => "Hello world!",
      say: (_,{name})=> `Hello ${name},How are you`
    },
  },
});
const PORT=Number(process.env.PORT)||8000;
app.get('/',(req ,res) => {
res.json({message: "Server is Running"})
})
//start graphql server

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log(`GraphQL Server completely ready at: ${url}`);
