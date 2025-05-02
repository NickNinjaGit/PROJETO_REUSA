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
    order: {
        type: DataTypes.INTEGER,
        required: true,
    },
    video: {
        type: DataTypes.STRING,
        required: true,
    },
    duration: {
        type: DataTypes.FLOAT,
        required: false,
    },

}, {timestamps: false});

export { Lesson };