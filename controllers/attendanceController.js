import Attendence from "../models/Attendence.js";

/* ================= MARK ATTENDANCE ================= */
export const markAttendance = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId required",
            });
        }

        // LOCAL DATE
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;

        // CHECK IF ALREADY MARKED
        const alreadyMarked = await Attendence.findOne({
            userId,
            date: formattedDate,
        });

        if (alreadyMarked) {
            return res.json({
                success: false,
                message: "Attendance already marked today",
            });
        }

        // CREATE ATTENDANCE
        await Attendence.create({
            userId,
            date: formattedDate,
            time: now.toLocaleTimeString(),
            status: "present",
        });

        return res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
        });

    } catch (err) {
        console.error("MARK ATTENDANCE ERROR", err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


/* ================= GET USER ATTENDANCE ================= */
export const getAttendanceByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const records = await Attendence.find({ userId }).sort({ date: 1 });

        return res.json(records);

    } catch (err) {
        console.error("GET ATTENDANCE ERROR", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
        });
    }
};


/* ================= MONTHLY ATTENDANCE (FOR CHART) ================= */
export const getMonthlyAttendance = async (req, res) => {
    try {
        const { userId } = req.params;

        const records = await Attendence.find({ userId });

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyData = {};

        // initialize months
        months.forEach((m) => {
            monthlyData[m] = {
                month: m,
                present: 0,
                absent: 0,
                leave: 0,
            };
        });

        // count attendance
        records.forEach((rec) => {
            const date = new Date(rec.date);
            const monthName = months[date.getMonth()];

            if (rec.status === "present") {
                monthlyData[monthName].present += 1;
            }
            else if (rec.status === "absent") {
                monthlyData[monthName].absent += 1;
            }
            else if (rec.status === "leave") {
                monthlyData[monthName].leave += 1;
            }
        });

        const result = Object.values(monthlyData);

        return res.json(result);

    } catch (err) {
        console.error("MONTHLY ATTENDANCE ERROR", err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};