import { prisma } from "../../lib/db.js";

const Query = {
  hello: () => "Hello world!",
  say: (_: any, { name }: { name: string }) => `Hello ${name}, How are you`
};

const Mutation = {
  createUser: async (
    _: any,
    { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }
  ) => {
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        salt: "random_salt_value",
      }
    });
    return newUser;
  }
};

export const resolvers = { Mutation, Query };