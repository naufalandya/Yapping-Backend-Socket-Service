'use strict'

const prisma = require("../libs/prisma.lib");
const { ErrorWithStatusCode } = require("../middlewares/error.middleware");
const likeController = async (req, res) => {
    const { yappin_id } = req.body;
    const user_id = Number(req.user.id); 
    try {


        if (!yappin_id) {
            return res.status(400).json({
                status: false,
                message: 'yappin_id is required!',
                data: null
            });
        }

        console.log(user_id, yappin_id);

        const existingLike = await prisma.yappinLike.findFirst({
            where: {
                user_id: user_id,
                yappin_id: Number(yappin_id)
            }
        });

        const yappin = await prisma.yappins.findUnique({ where: { id: Number(yappin_id) } });

        const io = req.app.get('io');

        if (!existingLike) {
            if (!yappin) {
                throw new ErrorWithStatusCode('Yappin not found', 404);
            }

            const user = await prisma.users.findUnique({ where: { id: user_id } });

            if (!user) {
                throw new ErrorWithStatusCode('User not found', 404);
            }

            // Mulai transaksi Prisma
            await prisma.$transaction(async (prisma) => {
                // Buat entri YappinLike dan simpan objek yang dikembalikan
                const newLike = await prisma.yappinLike.create({
                    data: {
                        user_id: user_id,
                        yappin_id: Number(yappin_id)
                    }
                });

                const message = `just liked your yappins!`;

                if (user_id !== yappin.user_id) {
                    // Buat entri like_notifications dengan yappin_like_id yang benar
                    await prisma.like_notifications.create({
                        data: {
                            user_id: yappin.user_id,
                            detail: message,
                            created_at: new Date(),
                            yappin_like_id: newLike.id, // Gunakan ID dari YappinLike
                            by_id : user_id
                        }
                    });

                    // Emit notifikasi melalui Socket.IO
                    io.emit(`user-${yappin.user_id}`, { 
                        username: user.username, 
                        message: message,
                        created_at : new Date(), 
                        redirect: `/${yappin_id}` 
                    });
                                    }

                // Update total_likes di yappins
                await prisma.yappins.update({
                    where: { id: Number(yappin_id) },
                    data: {
                        total_likes: {
                            increment: 1
                        }
                    }
                });

                return newLike;
            });

            return res.status(201).json({
                status: true,
                message: 'Yappin liked successfully!',
            });
        }

        if (existingLike) {
            // Mulai transaksi Prisma
            await prisma.$transaction(async (prisma) => {
                // Jika user bukan pemilik yappin, hapus notifikasi terlebih dahulu
                if (user_id !== yappin.user_id) {
                    const existingNotification = await prisma.like_notifications.findFirst({
                        where: {
                            user_id: yappin.user_id,
                            yappin_like_id: existingLike.id // Gunakan ID dari YappinLike
                        }
                    });

                    if (existingNotification) {
                        await prisma.like_notifications.delete({
                            where: {
                                id: existingNotification.id 
                            }
                        });
                    }
                }

                // Hapus entri YappinLike
                await prisma.yappinLike.delete({
                    where: { id: existingLike.id }
                });

                // Update total_likes di yappins
                await prisma.yappins.update({
                    where: { id: Number(yappin_id) },
                    data: {
                        total_likes: {
                            decrement: 1
                        }
                    }
                });
            });

            return res.status(200).json({
                status: true,
                message: 'Yappin unliked successfully!',
                data: null
            });
        } 

    } catch (err) {
        console.error('Error in likeController:', err);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null
        });
    } finally {
        const preference = await prisma.yappins.findUnique({
            where: {
                id: Number(yappin_id),
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
                    user_id: Number(user_id),
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
    }
}

module.exports = {
    likeController
};
