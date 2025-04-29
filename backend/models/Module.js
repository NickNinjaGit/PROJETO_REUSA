import db from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Lesson } from "./Lesson.js";

const Module = db.define("Module", {
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

Module.hasMany(Lesson);
Lesson.belongsTo(Module);

export { Module };