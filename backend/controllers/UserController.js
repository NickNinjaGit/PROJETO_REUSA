import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator"
// helpers
import { createUserToken } from "../helpers/create-user-token.js";
import { getToken } from "../helpers/get-token.js";
import { getUserByToken } from "../helpers/get-user-by-token.js";
import { refreshToken } from "../helpers/refresh-token.js";

// service
import { UserService } from "../services/UserService.js";

export class UserController {
  static async Register(req, res) {
    // get data
    const { name, email, password, confirmpassword } = req.body;
    // empty fields
    if (!name) {
      return res
        .status(422)
        .json({ message: "O nome é obrigatório", field: "name" });
    }
    if (!email) {
      return res
        .status(422)
        .json({ message: "O email é obrigatório", field: "email" });
    }
    if (!password) {
      return res
        .status(422)
        .json({ message: "A senha é obrigatória", field: "password" });
    }
    if (!confirmpassword) {
      return res
        .status(422)
        .json({
          message: "A confirmação de senha é obrigatória",
          field: "confirmpassword",
        });
    }
    // check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(422)
        .json({ message: "Por favor, use outro email", field: "email" });
    }
    // check if passwords match
    if (password !== confirmpassword) {
      return res
        .status(409)
        .json({ message: "As senhas não coincidem", field: "password" });
    }
    await UserService.RegisterService(req, res, name, email, password);
  }

  static async Login(req, res) {
    // get data
    const { email, password } = req.body;
    // empty fields
    if (!email) {
      return res
        .status(422)
        .json({ message: "O email é obrigatório", field: "email" });
    }
    if (!password) {
      return res
        .status(422)
        .json({ message: "A senha é obrigatória", field: "password" });
    }
    await UserService.LoginService(req, res, email, password);
  }

  static async Logout(req, res) {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout bem-sucedido" });
  }

 static async checkUser(req, res, next) {
  let currentUser = null;
  try {
    if (req.cookies.accessToken) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "ReusaSecret");

      currentUser = await User.findByPk(decoded.id);

      if (currentUser) {
        currentUser.password = undefined;

        // Montar a imageUrl
        const imageFile = currentUser.image && currentUser.image.trim() !== ""
          ? currentUser.image
          : "Default.png";

       

        // Envia o user com a imageUrl
        return res.status(200).json({
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            image: currentUser.image,
            score: currentUser.score,
          }
        });
      }
    } else {
      return res.status(401).json({ message: 'Access token missing or expired' });
    }
  } catch (error) {
    console.error('Error verifying token or fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
  const id = Number(req.params.id);
  const token = getToken(req);
  const user = await getUserByToken(req, res, token);
  if (!user) return;


  
  const { name, email } = req.body;
  let { password, confirmpassword } = req.body;

  const oldImage = user.image;

  if (req.file) {
    user.image = req.file.filename;  // so aqui voce sobrescreve com a nova
  }

  if (!validator.isEmail(email)) {
    return res
      .status(422)
      .json({ message: 'Formato de e-mail inválido', field: 'email' });
  }

  if (!name) {
    return res.status(422).json({ message: "O nome é obrigatório", field: "name" });
  }
  if (!email) {
    return res.status(422).json({ message: "O email é obrigatório", field: "email" });
  }

  const userExists = await User.findOne({ where: { email } });
  if (userExists && userExists.id !== Number(id)) {
    return res
      .status(422)
      .json({ message: "Por favor, use outro email", field: "email" });
  }

  // validação de senha somente se algum dos campos vier preenchido
  if (password || confirmpassword) {
    if (!password) {
      return res
        .status(422)
        .json({ message: "A senha é obrigatória", field: "password" });
    }
    if (!confirmpassword) {
      return res
        .status(422)
        .json({
          message: "A confirmação de senha é obrigatória",
          field: "confirmpassword",
        });
    }
    if (password.length < 6) {
    return res
      .status(422)
      .json({ message: "A senha deve ter pelo menos 6 caracteres", field: "password" });
      }
    if (password !== confirmpassword) {
      return res
        .status(409)
        .json({ message: "As senhas não coincidem", field: "password" });
    }
  } else {
    // se nenhum dos dois foi enviado, zera as variáveis para que o service nn altere elas
    password = null;
  }

  await UserService.UpdateService({
    user,
    name,
    email,
    password,
    oldImage,
    id,
    res
  });
}

  static async Delete(req, res)
  {
    // get id from params
    const id = req.params.id;
    if (!id) {
      res.status(422).json({ message: "O id é obrigatório", field: "id" });
      return;
    }
    // get token
    const token = getToken(req);
    // get user by token
    const user = await getUserByToken(req, res, token);
    await UserService.DeleteService(req, res, user, id);
  }
  static async refreshUserToken(req, res) {
    // get token
    const token = getToken(req);
    if (token === req.cookies.accessToken) {
      return res
        .status(200)
        .json({ message: "O token de acesso ainda é válido" });
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
