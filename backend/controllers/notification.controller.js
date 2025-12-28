// controllers/notification.controller.ts

import NotificationModel from "../models/Notification.model";

export const getMyNotifications = async (req, res) => {
    const { role, _id } = req.user;
    const data = await NotificationModel.find({
        $or: [
            { user: _id },
            { role },
            { role: "both" },
        ],
    }).sort({ createdAt: -1 });

    res.json(data);
};

export const createNotification = async (req, res) => {
    const noti = await NotificationModel.create(req.body);
    res.status(201).json(noti);
};

export const markAsRead = async (req, res) => {
    const n = await NotificationModel.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
    );
    res.json(n);
};
