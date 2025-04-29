import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const getUserByToken = async (req, res, token) => {
  if (!token) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  const decoded = jwt.verify(token, "ReusaSecret");
  const user = await User.findByPk(decoded.id);

  return user;
};

export { getUserByToken };
