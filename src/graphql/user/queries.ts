export const queries = `#graphql
  hello: String
  say(name: String!): String
  verifyPassword(email: String!, password: String!): Boolean
  getUserToken(email: String!, password: String!): String
  `;


  