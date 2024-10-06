const { likeController } = require('../controllers/like.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const like = require('express').Router()
    .post("/like", verifyToken, likeController)

module.exports = like