// ./routes/index.js
import contacts from "./contact.js";
import address from "./address.js";

const mountRoutes = (app) => {
  app.use("/contact/v1/address/v1", address);
  app.use("/contact/v1", contacts);
  // etc..
};

export default mountRoutes;
