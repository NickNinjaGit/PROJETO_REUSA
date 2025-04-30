import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// helpers
import { createUserToken } from "../helpers/create-user-token.js";
import { getToken } from "../helpers/get-token.js";
import { getUserByToken } from "../helpers/get-user-by-token.js";
import { refreshToken } from "../helpers/refresh-token.js";

export class UserController {
  static async Register(req, res) {
    // get data
    const { name, email, password, confirmpassword } = req.body;
    // empty fields
    if (!name) {
      return res.status(422).json({ message: "O nome é obrigatório", field: "name" });
    }
    if (!email) {
      return res.status(422).json({ message: "O email é obrigatório", field: "email" });
    }
    if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória", field: "password" });
    }
    if (!confirmpassword) {
      return res.status(422).json({ message: "A confirmação de senha é obrigatória", field: "confirmpassword" });
    }
    // check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(422).json({ message: "Por favor, use outro email", field: "email" });
    }
    // check if passwords match
    if (password !== confirmpassword) {
      return res.status(409).json({ message: "As senhas não coincidem", field: "password" });
    }
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

  static async Login(req, res) {
    // get data
    const { email, password } = req.body;
    // empty fields
    if (!email) {
      return res.status(422).json({ message: "O email é obrigatório", field: "email" });
    }
    if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória", field: "password" });
    }
    // check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado", field: "email" });
    }
    // check if password is correct
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (checkPassword === false) {
      return res.status(422).json({ message: "Senha inválida", field: "password" });
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
    res.status(200).json({ message: "Logout bem-sucedido" });
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
      res.status(404).json({ message: "Usuário não encontrado", field: "id" });
      return;
    }

    res.status(200).json({ user });
  }

  static async Update(req, res) {
    // get id from params
    const id = req.params.id;
    if (!id)
    {
      res.status(422).json({ message: "O id é obrigatório", field: "id" });
      return;
    }
    // get token
    const token = getToken(req);
    // get user by token
    const user = await getUserByToken(req, res, token);
    // get user data
    const { name, email, password, confirmpassword } = req.body;
    if (req.file) {
      user.image = req.file.filename;
    }
    // empty fields
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório", field: "name" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório", field: "email" });
      return;
    }
    // check if email exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists && userExists.id !== Number(id)) {
      res.status(422).json({ message: "Por favor, use outro email", field: "email" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória", field: "password" });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória", field: "confirmpassword" });
      return;
    }

    // check if passwords match
    if (password !== confirmpassword) {
      return res.status(409).json({ message: "As senhas não coincidem", field: "password" });
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

    res.status(200).json({ message: "Usuário atualizado com sucesso" });
  }

  static async refreshUserToken(req, res) {
    // get token
    const token = getToken(req);
    if (token === req.cookies.accessToken) {
      return res.status(200).json({ message: "O token de acesso ainda é válido" });
    }
    const user = await getUserByToken(req, res, token);
    // if no access token
    if (token === req.cookies.refreshToken) {
      // refresh old access token
      await refreshToken(req, res, user);
      res.status(200).json({ message: "Token atualizado com sucesso" });
    }
  }
}
