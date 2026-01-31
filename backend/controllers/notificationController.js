import Notification from "../models/notification.js";

// GET notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        const notifications = await Notification.find({
            receiver: userId
        })
        .populate("relatedUser", "firstName lastName profilePic")
        .populate("relatedPost", "image content")
        .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE single notification
export const deleteNotification = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        await Notification.findOneAndDelete({
            _id: id,
            receiver: userId
        });

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE all notifications
export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        await Notification.deleteMany({ receiver: userId });

        res.status(200).json({ message: "All notifications deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
