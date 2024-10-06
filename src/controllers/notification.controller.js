const prisma = require("../libs/prisma.lib");

/**
 * Get notification history for a user
 */
const getNotificationHistory = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: 'User ID is required',
        data: null,
      });
    }

    const notifications = await prisma.like_notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        detail: true,
        redirect: true,
        created_at: true,
        yappin_like_id: true,
        byusers: {
          select: {
            username: true
          }
        }
      }
    });

    console.log(notifications)

    return res.status(200).json({
      status: true,
      message: 'Notifications fetched successfully',
      data: notifications,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'An error occurred while fetching notifications',
      data: null,
    });
  }
};

module.exports = {
  getNotificationHistory,
};
