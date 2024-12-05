import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";
import Address from "./address.js";

const Contact = sequelize.define(
  "Contact",
  {
    contactId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    birthDate: { type: DataTypes.DATEONLY },
    title: { type: DataTypes.STRING(5) },
    firstName: { type: DataTypes.STRING(50) },
    lastName: { type: DataTypes.STRING(50) },
    middleName: { type: DataTypes.STRING(50) },
  },
  {
    freezeTableName: true,
    sequelize,
  }
);

Contact.hasMany(Address, {
  foreignKey: {
    name: "contactId",
  },
});

await sequelize.sync({ force: true });

export default Contact;

/*
await Contact.sync();
await contact.save();
console.log("contact was saved to the database!");
*/
