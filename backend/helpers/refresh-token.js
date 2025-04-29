import jwt from "jsonwebtoken";

const refreshToken = async (req, res, user) => {
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
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

};

export { refreshToken };
