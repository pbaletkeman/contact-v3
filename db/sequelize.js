import Sequelize from "sequelize";
import { loadEnvFile } from "process";

loadEnvFile(".env");

const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    // Choose one of the logging options
    logging: console.log, // Default, displays the first parameter of the log function call
    /*
  logging: (...msg) => console.log(msg), // Displays all log function call parameters
  logging: false, // Disables logging
  logging: msg => logger.debug(msg), // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
  logging: logger.debug.bind(logger), // Alternative way to use custom logger, displays all messages
  */
  }
);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default sequelize;
