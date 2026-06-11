import { Prisma } from "@prisma/client"; // 1. Import Prisma namespace for error type checking
import { createHmac, randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js"; 

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

const hashPassword = (password: string, salt: string) => {
    return createHmac("sha256", salt).update(password).digest("hex");
};

export class UserAlreadyExistsError extends Error {
    constructor(message: string = "A user with this email already exists.") {
        super(message);
        this.name = "UserAlreadyExistsError";
    }
}

class UserService {
    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const userSalt = randomBytes(32).toString("hex");
        const hashedPassword = hashPassword(password, userSalt);
        
        try {

            return await prisma.user.create({
                data: {
                    firstName,
                    lastName: lastName ?? "", 
                    email,
                    salt: userSalt,
                    password: hashedPassword
                }
            });
        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new UserAlreadyExistsError();
                }
            }
            // Fallback for any other unexpected database or connection issues
            throw error;
        }
    }

    public static async verifyPassword(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error("User not found");
        }

        const userSalt = user.salt;
        const hashedPassword = hashPassword(password, userSalt);

        if (hashedPassword !== user.password) {
            throw new Error("Incorrect password");
        }

        return true;
    }
//for get a usertoken
    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error("User not found");
        }

        const userSalt = user.salt;
        const hashedPassword = hashPassword(password, userSalt);
//check paassword match
        if (hashedPassword !== user.password) {
            throw new Error("Incorrect password");
        }
//genrate a jjet token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "threads-app-super-secret-key-2026",
            { expiresIn: "1d" }
        );

        return token;
    }
}

export default UserService;