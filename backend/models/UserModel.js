import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_link: {
      type: DataTypes.VIRTUAL,
      get() {
        console.log("Image value: ", this.getDataValue("image"));
        return `${process.env.APP_API_BASE}/images/user/${this.getDataValue(
          "image"
        )}`;
      },
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;
