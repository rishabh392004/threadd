import { GraphQLError } from "graphql";
import UserService, { type CreateUserPayload, UserAlreadyExistsError } from "../../service/user.js";

const Query = {
  hello: () => "Hello world!",
  say: (_: any, { name }: { name: string }) => `Hello ${name}, How are you`,
  verifyPassword: async (
    _: any,
    { email, password }: { email: string; password: string }
  ) => {
    try {
      const isValid = await UserService.verifyPassword({ email, password });
      return isValid;
    } catch (error: any) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    }
  },
  getUserToken: async (
    _: any,
    { email, password }: { email: string; password: string }
  ) => {
    try {
      const token = await UserService.getUserToken({ email, password });
      return token;
    } catch (error: any) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    }
  }
};

const Mutation = {
  createUser: async (
    _: any,
    { firstName, lastName, email, password }: { firstName: string; lastName?: string; email: string; password: string }
  ) => {
    // Safely build the payload object
    const payload: CreateUserPayload = {
      firstName,
      email,
      password,
      // If lastName is omitted/undefined in GraphQL, this completely leaves it out
      // of the object instead of explicitly passing `lastName: undefined`
      ...(lastName !== undefined ? { lastName } : {})
    };

    try {
      const newUser = await UserService.createUser(payload);
      return newUser;
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      throw error;
    }
  }
};

export const resolvers = { Mutation, Query };