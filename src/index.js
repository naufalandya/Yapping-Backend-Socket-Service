"use strict";


const express = require("express");
const bodyparser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const { handleError } = require("./middlewares/error.middleware");
const v1 = require("./api/v1.api");

require("dotenv").config();

var corsOptions = {
  origin: [
    "http://alobro.my.id",
    "http://localhost:5173",
    "http://localhost:3500",
    "https://bw2nj1xt-5173.asse.devtunnels.ms",
    "https://bw2nj1xt-3500.asse.devtunnels.ms"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true
};

const app = express()
  .set("trust proxy", 1)
  .use(cors(corsOptions))
  .use((req, res, next) => {
    console.log('CORS headers:', res.getHeaders());
    next();
  })
  .set("views", path.join(__dirname, "./views"))
  .use(logger("dev"))
  .use(express.json())
  .use(bodyparser.json())
  .use(express.urlencoded({ extended: true }))
  .use(bodyparser.urlencoded({ extended: true }))
  .use("/api", v1)
  //500
  .use((err, req, res, next) => {
    handleError(err, res)
  })

  //404
  .use((req, res, next) => {
    res.status(404).json({
      status: false,
      message: `are you lost? ${req.method} ${req.url} is not registered!`,
      data: null,
    });
  });

// const seedFlight = require("./seeds/cron-flight");
// const cron = require('node-cron');

// cron.schedule('0 0 * * *', () => {
//   seedFlight()
// });

module.exports = app