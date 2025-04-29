import jwt from "jsonwebtoken";
import "dotenv/config";

const createUserToken = async (user, req, res) => {
  // Create token
  const token = jwt.sign(
    {
      name: user.name,
      id: user.id,
      userRole: user.userRole,
    },
    "ReusaSecret",
    {
      expiresIn: "1d",
    }
  );

  // Enviar tokens nos cookies
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutos
  });

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });

  // Agora manda também os dados do usuário
  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.userRole,
  });
};

export { createUserToken };
