import { User } from "../models/User.js";
import bcrypt  from "bcrypt";

// helpers
import { createUserToken } from "../helpers/create-user-token.js";

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
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
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
        isAdmin: false,
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
    const {email, password} = req.body;
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
    if (checkPassword === false)
    {
        return res.status(422).json({ message: "Invalid password" });
    }
    // send response
    try {
        await createUserToken(user, req, res);
    }
    catch(error) { 
        return res.status(500).json({ message: error });
    }
  }
  static async Logout(req, res) {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout successful" });
  }
}
