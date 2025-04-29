import db from "../db/conn.js";
import { DataTypes } from "sequelize";
import { User } from "./User.js";
import { Post } from "./Post.js";

const Comment = db.define(
  "Comment",
  {
    content: {
      type: DataTypes.STRING,
      required: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      required: false,
    },
  },
);

User.hasMany(Comment);
Comment.belongsTo(User);
Post.hasMany(Comment);
Comment.belongsTo(Post);
export { Comment };
