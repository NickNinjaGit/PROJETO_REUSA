import {User} from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const createFirstAdmin = async () => {

    const adminExists = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });

    if (!adminExists) {
        const salt = bcrypt.genSaltSync(12);
        const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);
        const user = await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: passwordHash,
            confirmpassword: passwordHash,
            score: -1,
            image: "AdminPhoto.png",
            role: "ADMIN",
        });
    }
   
}