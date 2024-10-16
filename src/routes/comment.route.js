const { commentController, getCommentsController } = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const comment = require('express').Router()
    .post("/:id/comments", verifyToken, commentController)
    .get("/:id/comments", verifyToken, getCommentsController)

module.exports = comment