import { Appointment } from "../models/index.model.js";

export const getNextSerial = async (type) => {
    const prefix = type === "Walk-in" ? "WK" : "AP";

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Find latest appointment of today for this type
    const last = await Appointment.findOne({
        type,
        createdAt: { $gte: start, $lte: end },
    })
        .sort({ createdAt: -1 })
        .select("serialNo");

    let nextNum = 0;

    if (last?.serialNo) {
        const parts = last.serialNo.split("-");
        nextNum = parseInt(parts[1], 10) + 1;
    }

    const padded = String(nextNum).padStart(3, "0");
    return `${prefix}-${padded}`;
};
