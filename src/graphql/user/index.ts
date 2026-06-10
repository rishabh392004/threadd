import { mutations } from "./mutations.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";   // This holds your `type User { ... }`
import { queries } from "./queries.js";

// We rename the key from 'typeDefs' to 'types' so it matches your main server file!
export const User = { 
  types: typeDefs, 
  resolvers, 
  queries, 
  mutations 
};