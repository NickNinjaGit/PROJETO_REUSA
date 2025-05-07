import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export class AdminService {
  static async RegisterUserService(res, name, email, password, role) {
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
  static async UpdateUserService(res, id, name, email, password, role)
  {
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
  static async DeleteUserService(res, id)
  {
    // deletar o usuário
    try {
        // deletar imagens do servidor
        const user = await User.findByPk(id);
        const imagePath = path.resolve(
          "public",
          "images",
          "users",
          user.image
        )
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Deleta o arquivo de forma síncrona
        }
        await User.destroy({ where: { id } });
        res.status(200).json({ message: "Usuário deletado com suecesso" });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Erro ao deletar usuário", error });
      }
  }
}
