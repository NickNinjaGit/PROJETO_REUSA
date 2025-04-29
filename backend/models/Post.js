import db from "../db/conn.js";
import { DataTypes } from "sequelize";

const Post = db.define("Post", {
    title: {
        type: DataTypes.STRING,
        required: true,
    },
    content: {
        type: DataTypes.STRING,
        required: true,
    },
    likes: {
        type: DataTypes.INTEGER,
        required: false,
    },

});


export { Post };