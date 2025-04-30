import db from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";
import { Prize } from "./Prize.js";
import { Course } from "./Course.js";

const User = db.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("USER", "INSTRUCTOR", "COMPANY", "ADMIN"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["USER", "INSTRUCTOR", "COMPANY", "ADMIN"]],
          msg: "Role inválido, use USER, INSTRUCTOR, COMPANY ou ADMIN",
        },
      },
    },
  },
  { timestamps: false }
);
// relação User-Post (para usuários comuns)
User.hasMany(Post);
Post.belongsTo(User);

// relação User-Course (para instrutores)
User.hasMany(Course);
Course.belongsTo(User);

// relação User-Prize (para parcerias)
User.hasMany(Prize);
Prize.belongsTo(User);
export { User };
