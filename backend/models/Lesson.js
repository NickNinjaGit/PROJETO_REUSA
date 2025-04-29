import db from "../db/conn.js";
import { DataTypes } from "sequelize";

const Lesson = db.define("Lesson", {
    title: {
        type: DataTypes.STRING,
        required: true,
    },
    description: {
        type: DataTypes.STRING,
        required: true,
    },
    duration: {
        type: DataTypes.STRING,
        required: false,
    },

}, {timestamps: false});

export { Lesson };