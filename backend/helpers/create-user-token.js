import jwt from "jsonwebtoken";
import "dotenv/config";

const createUserToken = async (user, req, res) => {
    // Create token
    const token = jwt.sign(
        {
            name: user.name,
            id: user.id,
            userRole: user.userRole
        }, 
        "ReusaSecret",
        {
            expiresIn: "1d"
        }
    );
    // console.log(`token: ${token}`);
    // Send token
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
   
    // send response
    return res.status(201).json({ message: "User loged successfully" });
}

export { createUserToken };