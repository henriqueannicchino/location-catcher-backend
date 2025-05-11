const express = require("express");
const routes = express.Router();

routes.get("/hello", (req, res) => {
  res.send({ message: "Hello World" });
});

const TelegramBotController = require("./controllers/TelegramBotController");
routes.post("/sendLocation", TelegramBotController.store);

module.exports = routes;
