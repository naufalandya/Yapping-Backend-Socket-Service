const like = require('../routes/like.route');
const notifications = require('../routes/notification.route');

const v1 = require('express').Router()
    .use("/users", like)
    .use("/notifications", notifications)

module.exports = v1