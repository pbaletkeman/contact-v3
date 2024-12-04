import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Address = sequelize.define(
  "Address",
  {
    addressId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    country: { type: DataTypes.STRING(6) },
    postalCode: { type: DataTypes.STRING(15) },
    phone: { type: DataTypes.STRING(15) },
    province: { type: DataTypes.STRING(20) },
    city: { type: DataTypes.STRING(50) },
    street1: { type: DataTypes.STRING(100) },
    street2: { type: DataTypes.STRING(100) },
    email: { type: DataTypes.STRING(250) },
  },
  {
    freezeTableName: true,
    sequelize,
  }
);

export default Address;
