"use strict";

const { subDays, startOfDay, endOfDay } = require('date-fns');

const express = require("express");
const bodyparser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const { handleError } = require("./middlewares/error.middleware");
const v1 = require("./api/v1.api");
const { handleYappinStats } = require("./controllers/asistant.controller");
const { verifyToken, verifyTokenParameter } = require("./middlewares/auth.middleware");
const prisma = require("./libs/prisma.lib");

require("dotenv").config();

var corsOptions = {
  origin: [
    "http://localhost:5174/",
    "http://alobro.my.id",
    "http://localhost:5174",
    "http://localhost:3500",
    "https://bw2nj1xt-5174.asse.devtunnels.ms",
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
  .get("/chat",verifyToken, handleYappinStats)
  .post('/usage', verifyTokenParameter, async (req, res) => {
    const duration = Number(req.query.duration);
    const userId = Number(req.user.id);

    console.log(duration)

    if (!duration || typeof duration !== 'number') {
      console.log(duration)
      return res.status(400).json({ message: 'Duration must be number' });
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Mulai hari ini  
    try {
      const usageRecord = await prisma.usageRecord.upsert({
        where: {
          userId_date: {
            userId: userId,
            date: today,
          },
        },
        update: {
          duration: {
            increment: duration,
          },
        },
        create: {
          userId: userId,
          date: today,
          duration: duration,
        },
      });
  
      res.status(200).json({ message: 'success', usageRecord });
    } catch (error) {
      console.error('Error mencatat penggunaan:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
  .get("/time-statistic", verifyToken, async(req, res) => {
    try {
      const userId = Number(req.user.id);
  
      const weeklyUsage = [];
      let totalDurationInSeconds = 0;
  
      for (let i = 0; i < 8; i++) {
        const currentDate = subDays(new Date(), i);
        const startOfDayTime = startOfDay(currentDate);
        const endOfDayTime = endOfDay(currentDate);
  
        const usageRecord = await prisma.usageRecord.findMany({
          where: {
            userId: userId,
            date: {
              gte: startOfDayTime,
              lte: endOfDayTime,
            },
          },
        });
  
        const totalDurationForDay = usageRecord.reduce((total, record) => {
          return total + record.duration;
        }, 0);
  
        weeklyUsage.push({
          day: i === 0 ? 'Now' : i === 1 ? 'D-1' : `D-${i}`,
          durationInSeconds: totalDurationForDay,
        });
  
        totalDurationInSeconds += totalDurationForDay;
      }
  
      const totalHoursInWeek = (totalDurationInSeconds / 3600).toFixed(2);
  
      return res.status(200).json({
        status: 'success',
        message: 'Weekly usage retrieved successfully',
        data: {
          weekly: weeklyUsage,
          total_hours_in_a_week: totalHoursInWeek,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while fetching usage data',
      });
    }
  
  })
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