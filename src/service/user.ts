import {createHmac,randomBytes} from "crypto";
import { PrismaClient } from "../generated/prisma/index.js";
import {User} from "../graphql/user/index.js";
 export interface CreateUserPayload{
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}
const salt = randomBytes(32).toString("hex");
const hashPassword = (password: string, salt: string) => {
    return createHmac("sha256", salt).update(password).digest("hex");
};

class UserService{
public static createUser(payload: CreateUserPayload){
    const {firstName, lastName, email, password} = payload;
    const hashedPassword = hashPassword(password, salt);
    return PrismaClient.User.create({
        data:{
            firstName,
            lastName,
            email,
            salt,
            password: hashedPassword
        }
    })
}
}
export default UserService;