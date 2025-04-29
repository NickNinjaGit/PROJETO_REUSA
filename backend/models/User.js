import db from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";

const User = db.define("User", {
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
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
  },

}, {timestamps: false});
User.hasMany(Post);
Post.belongsTo(User);
export { User };
