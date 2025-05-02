import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export class AdminController {
  static async Dashboard(req, res) {
    const users = await User.findAll();
    res.status(200).json({ users });
  }
  static async CreateUser(req, res) {
    if (!req.body) {
      res.status(400).json({ message: "Requisição inválida" });
      return;
    }
    // pega os dados preenchidos no form
    const { name, email, password, confirmpassword, score, role } = req.body;

    // validações
    // campos vazios?
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
      return res.status(422).json({
        message: "A confirmação de senha é obrigatória",
        field: "confirmpassword",
      });
    }
    if (!role) {
      return res
        .status(422)
        .json({ message: "O papel é obrigatório", field: "role" });
    }
    // usuário já cadastrado?
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(422)
        .json({ message: "Usuário ja cadastrado", field: "email" });
    }

    // senhas iguais?
    if (password !== confirmpassword) {
      return res
        .status(422)
        .json({ message: "As senhas não coincidem", field: "password" });
    }

    // hash da senha
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // cria o usuário
    try {
      const user = await User.create({
        name,
        email,
        password: passwordHash,
        score: 0,
        role,
      });
      res.status(201).json({ message: "Usuário criado com suecesso", user });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar usuário", error });
    }
  }
  static async getUserById(req, res) {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    // verifica se o usuário é o primeiro admin para ele não editar seus privilegios
    if (Number(id) === 1) {
      // remover o campo role da respota
      return res
        .status(200)
        .json({ ...user.dataValues, score: undefined, role: undefined });
    }
    return res.status(200).json({ user });
    // verifica se o usuário é admin para ele não editar seus privilegios
  }
  static async UpdateUser(req, res) {
    const { id } = req.params;

    // verificar se o usuário é o primeiro admin
    if (Number(id) === 1) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    // checar se o corpo da requisição é vazio
    if (!req.body) {
      return res.status(400).json({ message: "Requisição inválida" });
    }
    // pegar dados do form
    const { name, email, password, confirmpassword, role } = req.body;

    // validações
    // campos vazios?
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
    // usuário já cadastrado?
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(422)
        .json({ message: "Usuário ja cadastrado", field: "email" });
    }
    if (!password) {
      return res
        .status(422)
        .json({ message: "A senha é obrigatória", field: "password" });
    }
    if (!confirmpassword) {
      return res.status(422).json({
        message: "A confirmação de senha é obrigatória",
        field: "confirmpassword",
      });
    }
    if (!role) {
      return res
        .status(422)
        .json({ message: "O papel é obrigatório", field: "role" });
    }
    // senhas iguais?
    if (password !== confirmpassword) {
      return res
        .status(422)
        .json({ message: "As senhas não coincidem", field: "password" });
    }

    // hash da senha
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // atualiza o usuário
    try {
      const userData = { name, email, password: passwordHash, role };
      const user = await User.update(
        {
          ...userData,
        },
        { where: { id } }
      );
      res
        .status(200)
        .json({ message: "Usuário atualizado com suecesso", userData });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar usuário", error });
    }
  }
  static async DeleteUser(req, res) {
    const { id } = req.params;
    // verificar se o usuário é o primeiro admin
    if (Number(id) === 1) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    // deletar o usuário
    try {
      await User.destroy({ where: { id } });
      res.status(200).json({ message: "Usuário deletado com suecesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao deletar usuário", error });
    }
  }
  static async Courses(req, res) {
    res
      .status(200)
      .json({
        message: "Admin detectado, redirecionando para gerenciamento de cursos",
      });
  }
}
