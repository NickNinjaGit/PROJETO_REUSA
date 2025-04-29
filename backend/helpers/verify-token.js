import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const verified = jwt.verify(token, "ReusaSecret");
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(400).json({message: 'Token invalido!'});
    }
}