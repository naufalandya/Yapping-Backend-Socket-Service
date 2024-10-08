const { likeController } = require('../controllers/like.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const comment = require('express').Router()
    .post("/comment", verifyToken, likeController)

module.exports = comment