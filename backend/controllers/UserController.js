import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// helpers
import { createUserToken } from "../helpers/create-user-token.js";
import { getToken } from "../helpers/get-token.js";
import { verifyToken } from "../helpers/verify-token.js";
import { getUserByToken } from "../helpers/get-user-by-token.js";
import { refreshToken } from "../helpers/refresh-token.js";

export class UserController {
  static async Register(req, res) {
    // get data
    const { name, email, password, confirmpassword } = req.body;
    // empty fields
    if (!name) {
      return res.status(422).json({ message: "Name is required" });
    }
    if (!email) {
      return res.status(422).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(422).json({ message: "Password is required" });
    }
    if (!confirmpassword) {
      return res.status(422).json({ message: "Confirm password is required" });
    }
    // check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(422).json({ message: "Please use another email" });
      return;
    }
    // check if passwords match
    if (password !== confirmpassword) {
      return res.status(409).json({ message: "Passwords do not match" });
    }
    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      score: 0,
      userRole: "user",
    });
    // send response
    try {
      // create user
      await createUserToken(user, req, res);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  static async Login(req, res) {
    // get data
    const { email, password } = req.body;
    // empty fields
    if (!email) {
      return res.status(422).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(422).json({ message: "Password is required" });
    }
    // check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if password is correct
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (checkPassword === false) {
      return res.status(422).json({ message: "Invalid password" });
    }
    // send response
    try {
      await createUserToken(user, req, res);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  static async Logout(req, res) {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout successful" });
  }
  static async checkUser(req, res, next) {
    let currentUser = null;
    if (req.cookies.accessToken) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "ReusaSecret");
      currentUser = await User.findByPk(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).json({ user: currentUser });
  }
  static async getUserById(req, res) {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  }
  static async Update(req, res) {
    // get id from params
    const id = req.params.id;
    // get token
    const token = getToken(req);
    // get user by token
    const user = await getUserByToken(req, res, token);
    console.log(user);
    // get user data
    const { name, email, password, confirmpassword } = req.body;
    if (req.file) {
      user.image = req.file.filename;
    }
    // empty fields
    if (!name) {
      res.status(422).json({ message: "Name is required" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "Email is required" });
      return;
    }
    // check if email exists
    const userExists = await User.findOne({ where: { email } });
    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Please use another email" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "Password is required" });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "Confirm password is required" });
      return;
    }

    // check if passwords match
    if (password !== confirmpassword) {
      return res.status(409).json({ message: "Passwords do not match" });
    } 

    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    // update user, send response
    await User.update({
      name,
      email,
      password: passwordHash,
      image: user.image,
    }, {
      where: {
        id
      }
    });

    res.status(200).json({ message: "User updated successfully" });
  }
  static async refreshUserToken(req, res) {
    // get token
    const token = getToken(req);
    if (token === req.cookies.accessToken) {
      return res.status(200).json({ message: "Access token is valid yet" });
    }
    const user = await getUserByToken(req, res, token);
    // if no access token
    if (token === req.cookies.refreshToken) {
      // refresh old access token
      await refreshToken(req, res, user);
      res.status(200).json({ message: "Token refreshed successfully" });
    }
  }
}
