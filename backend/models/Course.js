import db from "../db/conn.js";
import { DataTypes } from "sequelize";
import { Module } from "./Module.js";

const Course = db.define("Course", {
    title: {
        type: DataTypes.STRING,
        required: true
    },
    description: {
        type: DataTypes.STRING,
        required: true
    },
    duration: {
        type: DataTypes.FLOAT,
        required: true,
    },
    thumbnail: {
        type: DataTypes.STRING,
        required: true,
    }
});

Course.hasMany(Module, { onDelete: "CASCADE" });
Module.belongsTo(Course);

export { Course };