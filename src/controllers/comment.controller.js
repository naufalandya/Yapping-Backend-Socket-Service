'use strict'

const prisma = require("../libs/prisma.lib");
const { ErrorWithStatusCode } = require("../middlewares/error.middleware");

const commentController = async (req, res) => {
    try {
        const { yappin_id, content } = req.body;
        const user_id = Number(req.user.id);  

        if (!yappin_id || !content) {
            return res.status(400).json({
                status: false,
                message: 'yappin_id and content are required!',
                data: null
            });
        }

        const yappin = await prisma.yappins.findUnique({ where: { id: yappin_id } });

        if (!yappin) {
            throw new ErrorWithStatusCode('Yappin not found', 404);
        }

        const user = await prisma.users.findUnique({ where: { id: user_id } });

        if (!user) {
            throw new ErrorWithStatusCode('User not found', 404);
        }

        const io = req.app.get('io'); 

        await prisma.$transaction(async (prisma) => {
            // Buat entri YappinComment
            const newComment = await prisma.yappinComment.create({
                data: {
                    user_id: user_id,
                    yappin_id: yappin_id,
                    content: content,
                    created_at: new Date()
                }
            });

            const message = `just commented on your yappin!`;

            if (user_id !== yappin.user_id) {
                await prisma.comment_notifications.create({
                    data: {
                        user_id: yappin.user_id, // User pemilik Yappin
                        detail: message,
                        created_at: new Date(),
                        yappin_comment_id: newComment.id, // ID dari komentar yang baru
                        by_id: user_id // User yang memberi komentar
                    }
                });

                // Emit notifikasi melalui Socket.IO
                io.emit(`user-${yappin.user_id}`, { 
                    username: user.username, 
                    message: message,
                    created_at: new Date(),
                    redirect: `/${yappin_id}` 
                });
            }

            // Kembalikan respons berhasil
            return res.status(201).json({
                status: true,
                message: 'Comment added successfully!',
                data: newComment
            });
        });

    } catch (err) {
        console.error('Error in commentController:', err);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null
        });
    }
};

const deleteCommentController = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const user_id = Number(req.user.id);

        const comment = await prisma.yappinComment.findUnique({
            where: { id: Number(comment_id) }
        });

        if (!comment) {
            return res.status(404).json({
                status: false,
                message: 'Comment not found!',
                data: null
            });
        }

        if (comment.user_id !== user_id) {
            return res.status(403).json({
                status: false,
                message: 'You do not have permission to delete this comment!',
                data: null
            });
        }

        await prisma.$transaction(async (prisma) => {
            // Hapus notifikasi yang berhubungan dengan komentar
            await prisma.comment_notifications.deleteMany({
                where: { yappin_comment_id: comment.id }
            });

            // Hapus komentar
            await prisma.yappinComment.delete({
                where: { id: comment.id }
            });
        });

        return res.status(200).json({
            status: true,
            message: 'Comment deleted successfully!',
            data: null
        });

    } catch (err) {
        console.error('Error in deleteCommentController:', err);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null
        });
    }
};

module.exports = {
    commentController,
    deleteCommentController
};