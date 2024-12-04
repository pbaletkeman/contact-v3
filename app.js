import express from "express";
import expressOasGenerator from "express-oas-generator";
import mountRoutes from "./controller/index.js";

var app = express();

app.set("port", process.env.PORT || 4000);
mountRoutes(app);

const server = app.listen(app.get("port"), function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Node.js API app running at http://%s:%s", host, port);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Closing server...");
  server.close(() => {
    console.log("Server closed. Exiting process...");
    process.exit(0);
  });
});

expressOasGenerator.init(app, {});
