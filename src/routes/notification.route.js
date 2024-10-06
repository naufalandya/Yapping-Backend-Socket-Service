const { getNotificationHistory } = require('../controllers/notification.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const notifications = require('express').Router()
    .get("/", verifyToken, getNotificationHistory)

module.exports = notifications