import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// helpers
import { createUserToken } from "../helpers/create-user-token.js";
import { getToken } from "../helpers/get-token.js";
import { getUserByToken } from "../helpers/get-user-by-token.js";
import { refreshToken } from "../helpers/refresh-token.js";

import path from "path";
import fs from "fs";
import { Console } from "console";

export class UserService {
  static async RegisterService(req, res, name, email, password) {
    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      score: 0,
      role: "USER",
    });
    // send response
    try {
      // create user
      await createUserToken(user, req, res);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  static async LoginService(req, res, email, password) {
     if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    // check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado", field: "email" });
    }
    // check if password is correct
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (checkPassword === false) {
      return res
        .status(422)
        .json({ message: "Senha inválida", field: "password" });
    }
    // send response
    try {
      await createUserToken(user, req, res);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  

  static async UpdateService({
      user,         // Sequelize instance
      name,         // string
      email,        // string
      password,     // string|null
      oldImage,     // string|null
      id,           // number
      res           // express.Response
    }) {
    // encrypt password
    let passwordHash = user.password;

  
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      passwordHash = bcrypt.hashSync(password, salt);
    }
    
    if (oldImage) {
    const oldImagePath = path.resolve(
      process.cwd(), "public", "images", "users", oldImage
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

    await User.update(
    {
      name,
      email,
      password: passwordHash,
      image: user.image,  // agr é o filename novo
    },
    { where: { id } }
  );

  // busca de volta o user atualizado
  const userData = await User.findByPk(id);

  // responde
  return res
    .status(200)
    .json({ message: "Usuário atualizado com sucesso", user: userData });
  }

  
  static async DeleteService(req, res, user, id) {
    // find image related to user and delete it
    const image = user.image;
    const imagePath = path.resolve("public", "images", "users", image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await User.destroy({ where: { id } });

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  }
}
