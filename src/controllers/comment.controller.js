'use strict'

const prisma = require("../libs/prisma.lib");
const { ErrorWithStatusCode } = require("../middlewares/error.middleware");

const getCommentsController = async (req, res) => {
    try {
        const { id } = req.params;


        if (!id) {
            return res.status(400).json({
                status: false,
                message: 'yappin_id is required!',
                data: null
            });
        }

        const yappin_id = id

        // Cek apakah yappin dengan ID yang diberikan ada
        const yappin = await prisma.yappins.findUnique({
            where: { id: Number(yappin_id) }
        });

        if (!yappin) {
            return res.status(404).json({
                status: false,
                message: 'Yappin not found!',
                data: null
            });
        }

        // Ambil semua komentar berdasarkan yappin_id
        const comments = await prisma.yappinComment.findMany({
            where: { yappin_id: Number(yappin_id) },
            include: {
                users: { // Sertakan data user yang membuat komentar
                    select: {
                        id: true,
                        username: true,
                        avatar_link: true // Jika ada profile picture atau avatar
                    }
                }
            },
            orderBy: {
                created_at: 'desc' // Urutkan dari komentar terbaru
            }
        });

        return res.status(200).json({
            status: true,
            message: 'Comments retrieved successfully!',
            data: comments
        });

    } catch (err) {
        console.error('Error in getCommentsController:', err);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null
        });
    }
};

const commentController = async (req, res) => {

    const the_id = Number(req.user.id);  
    const { yappin_id, content } = req.body;

    try {
        const user_id = Number(req.user.id);  

        if (!yappin_id || !content) {
            return res.status(400).json({
                status: false,
                message: 'yappin_id and content are required!',
                data: null
            });
        }

        const yappin = await prisma.yappins.findUnique({ where: { id: Number(yappin_id) } });

        if (!yappin) {
            throw new ErrorWithStatusCode('Yappin not found', 404);
        }

        const user = await prisma.users.findUnique({ where: { id: user_id } });

        if (!user) {
            throw new ErrorWithStatusCode('User not found', 404);
        }


        const response = await fetch('http://localhost:5000/check-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: content || '',
            }),
        });
        
        if (!response.ok) {
            return res.status(400).json({
                status: false,
                message: 'Your words contains negativity, bad word, or profanity !',
                data: null
            });
        }
        

        const io = req.app.get('io'); 

        const newComment = await prisma.yappinComment.create({
            data: {
                user_id: user_id,
                yappin_id: Number(yappin_id),
                content: content,
                created_at: new Date()
            },
            include: {
                users: { // Menyertakan data pengguna
                    select: {
                        username: true,
                        avatar_link: true // Tambahkan field lain jika diperlukan
                    }
                }
            }
        });

        const message = `just commented on your yappin!`;

        if (user_id !== yappin.user_id) {
            await prisma.comment_notifications.create({
                data: {
                    user_id: yappin.user_id, 
                    detail: message,
                    created_at: new Date(),
                    yappin_comment_id: newComment.id, 
                    by_id: user_id,
                    redirect : String(yappin_id)
                }
            });

            io.emit(`user-${yappin.user_id}`, { 
                avatar_link : user.avatar_link,
                username: user.username, 
                message: message,
                created_at: new Date(),
                redirect: `${yappin_id}` 
            });
        }

        const preference = await prisma.yappins.update({
            where: { id: Number(yappin_id) },
            data: {
                total_comments: {
                    increment: 1
                }
            }
        });
        
        const tag_one = preference.tag_one_name;
        
        let user_tags = [
            req.user.preference_one,
            req.user.preference_two,
            req.user.preference_three,
            req.user.preference_four
        ];
        
        let matchedTagIndex = user_tags.findIndex(tag => tag === tag_one);
        
        if (matchedTagIndex !== -1) {
            let totalEngageField = `total_engage_${['one', 'two', 'three', 'four'][matchedTagIndex]}`;
        
            await prisma.preference_yappin.update({
                where: {
                    user_id: Number(the_id),
                },
                data: {
                    [totalEngageField]: { // Field dinamis
                        increment: 1
                    }
                }
            });
        
            console.log(`Updated ${totalEngageField} with increment`);
        } else {
            console.log("No matching tag found between preference.tag_one_name and user_tags.");
        }

        return res.status(201).json({
            status: true,
            message: 'Comment added successfully!',
            data: newComment
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
    getCommentsController,
    commentController,
    deleteCommentController
};