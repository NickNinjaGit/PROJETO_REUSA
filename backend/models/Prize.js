import db from "../db/conn.js";
import { DataTypes } from "sequelize";

const Prize = db.define("Prize", {
    name: {
        type : DataTypes.STRING,
        required: true
    },
    description: {
        type : DataTypes.STRING,
        required: true
    },
    coupon: {
        type : DataTypes.STRING,
        required: true
    },
    image: {
        type : DataTypes.STRING,
        required: true
    },
    price: {
        type: DataTypes.INTEGER,
        required: true
    },
    discountValue: {
        type: DataTypes.INTEGER,
        required: true
    }
}, {timestamps: false});

export { Prize };