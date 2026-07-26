import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import Webcam from "react-webcam";
import api from "../services/api";
import "react-calendar/dist/Calendar.css";

const AttendancePage = () => {
    const webcamRef = useRef(null);
    const userId = localStorage.getItem("userId");

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState([]);
    const [showCamera, setShowCamera] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ LOCAL DATE FORMAT (NO UTC ISSUE)
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const todayStr = formatDate(new Date());

    // ================= FETCH ATTENDANCE =================
    const fetchAttendance = async () => {
        try {
            if (!userId) return;

            const res = await api.get(`/attendance/${userId}`);

            const formattedDates = Array.isArray(res.data)
                ? res.data.map((d) =>
                    formatDate(typeof d === "string" ? d : d.date)
                )
                : [];

            setMarkedDates(formattedDates);
        } catch (err) {
            console.log("Fetch error:", err);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAttendance();
        }
    }, [userId]);

    const selectedStr = formatDate(selectedDate);
    const alreadyMarked = markedDates.includes(todayStr);

    // ================= MARK BUTTON =================
    const handleMarkClick = () => {
        if (!userId) {
            setMsg("User not logged in ❌");
            return;
        }

        if (selectedStr !== todayStr) {
            setMsg("❌ Only today's attendance allowed");
            return;
        }

        if (alreadyMarked) {
            setMsg("✅ Attendance already marked today");
            return;
        }

        setMsg("");
        setShowCamera(true);
    };

    // ================= CAPTURE =================
    const captureAndMark = async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
            setMsg("Camera capture failed ❌");
            return;
        }

        setLoading(true);

        try {
            const blob = await (await fetch(imageSrc)).blob();

            const formData = new FormData();
            formData.append("image", blob);
            formData.append("userId", userId);

            const res = await api.post("/face/match-face", formData);

            console.log("Face Match Response:", res.data);

            // ❌ Face not matched
            if (!res.data.success) {
                setMsg(res.data.message);
                setLoading(false);
                return;
            }

            // ✅ Update calendar
            setMarkedDates((prev) =>
                prev.includes(todayStr)
                    ? prev
                    : [...prev, todayStr]
            );

            setShowCamera(false);

            // ✅ Show backend message
            setMsg(res.data.message);

        } catch (err) {
            console.log(err);

            setMsg(
                err.response?.data?.message ||
                "Attendance failed ❌"
            );
        }

        setLoading(false);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Smart Attendance System</h2>

                <Calendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    tileClassName={({ date }) => {
                        const dateStr = formatDate(date);

                        // ✅ Present ko pehle check karo
                        if (markedDates.includes(dateStr)) return "present";

                        if (dateStr === todayStr) return "today";

                        return null;
                    }}
                />

                <button
                    onClick={handleMarkClick}
                    disabled={alreadyMarked}
                    style={{
                        ...styles.button,
                        background: alreadyMarked
                            ? "#9ca3af"
                            : "#2563eb",
                    }}
                >
                    {alreadyMarked
                        ? "Attendance Marked Today"
                        : "Mark Attendance"}
                </button>

                {showCamera && (
                    <div style={styles.cameraBox}>
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }}
                            style={styles.video}
                        />

                        <button
                            style={styles.captureBtn}
                            onClick={captureAndMark}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Capture & Mark"}
                        </button>
                    </div>
                )}

                {msg && <p style={styles.message}>{msg}</p>}
            </div>

            <style>{`
                .react-calendar {
                    width: 100%;
                    border-radius: 12px;
                    padding: 15px;
                    background: #ffffff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                }

                .present {
                    background: #16a34a !important;
                    color: white !important;
                    border-radius: 50%;
                    font-weight: 600;
                }

                .today {
                    background: #e0f2fe !important;
                    border-radius: 50%;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default AttendancePage;

// ✅ STYLES OBJECT (IMPORTANT)
const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
    },
    card: {
        background: "#ffffff",
        padding: "35px",
        borderRadius: "18px",
        width: "430px",
        textAlign: "center",
        color: "#1f2937",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    heading: {
        marginBottom: "20px",
        fontWeight: "600",
    },
    button: {
        marginTop: "20px",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
    },
    cameraBox: {
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
    },
    video: {
        width: "320px",
        borderRadius: "12px",
    },
    captureBtn: {
        padding: "10px 20px",
        background: "#16a34a",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
    },
    message: {
        marginTop: "15px",
        fontWeight: "500",
    },
};