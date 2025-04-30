import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const isInstructor = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  // verifica se o usuário é admin através das informações do token
  const decoded = jwt.decode(token);
  const user = await User.findByPk(decoded.id);
  // se for um admin, redireciona para a rota de gerenciamento de cursos
  if (user.role === "ADMIN")
  {
    return res.redirect("/admin/courses").status(200);
  }
  if (user.role !== "INSTRUCTOR") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
};

export { isInstructor };
