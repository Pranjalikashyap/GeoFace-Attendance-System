import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MonthlyChart from "../components/MonthlyChart";

const Dashboard = () => {
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        leave: 0,
    });

    /* ================= FETCH STATS ================= */

    const fetchStats = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/attendance/stats/${userId}`
            );

            setStats(res.data);
        } catch (err) {
            console.log("Stats error:", err);
        }
    };

    useEffect(() => {
        // ✅ Admin Redirect
        if (role === "admin") {
            navigate("/admin", { replace: true });
            return;
        }

        // ✅ Employee Stats
        if (role === "employee" && userId) {
            fetchStats();
        }
    }, [role, userId, navigate]);

    /* ================= PERCENTAGE ================= */

    const total =
        stats.present +
        stats.absent +
        stats.leave;

    const percentage =
        total > 0
            ? Math.round(
                (stats.present / total) * 100
            )
            : 0;

    return (
        <div style={styles.layout}>
            <div style={styles.main}>
                <h1 style={styles.welcome}>
                    Welcome,{" "}
                    {role === "admin"
                        ? "Admin"
                        : username || "User"}{" "}
                    👋
                </h1>

                {/* ================= CIRCLE ================= */}

                {role === "employee" && (
                    <>
                        <div style={styles.circleContainer}>
                            <div style={styles.circle}>
                                <svg
                                    width="200"
                                    height="200"
                                >
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        stroke="#e5e7eb"
                                        strokeWidth="15"
                                        fill="none"
                                    />

                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        stroke="#2563eb"
                                        strokeWidth="15"
                                        fill="none"
                                        strokeDasharray={502}
                                        strokeDashoffset={
                                            502 -
                                            (502 *
                                                percentage) /
                                            100
                                        }
                                        strokeLinecap="round"
                                        transform="rotate(-90 100 100)"
                                    />
                                </svg>

                                <div
                                    style={
                                        styles.circleText
                                    }
                                >
                                    {percentage}%
                                    <p
                                        style={{
                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        Attendance
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ================= STATS ================= */}

                        <div style={styles.statsRow}>
                            <div
                                style={styles.statBox}
                            >
                                <h3>
                                    {stats.present}
                                </h3>
                                <p>Present</p>
                            </div>

                            <div
                                style={styles.statBox}
                            >
                                <h3>
                                    {stats.absent}
                                </h3>
                                <p>Absent</p>
                            </div>

                            <div
                                style={styles.statBox}
                            >
                                <h3>{stats.leave}</h3>
                                <p>Leave</p>
                            </div>
                        </div>

                        {/* ================= MONTHLY CHART ================= */}

                        <MonthlyChart
                            userId={userId}
                        />

                        {/* ================= ATTENDANCE PAGE ================= */}

                        <div
                            style={
                                styles.attendanceCard
                            }
                            onClick={() =>
                                navigate(
                                    "/attendance"
                                )
                            }
                        >
                            Go to Attendance Page
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

/* ================= STYLES ================= */

const styles = {
    layout: {
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
    },

    main: {
        flex: 1,
        padding: "40px",
        textAlign: "center",
    },

    welcome: {
        color: "#1e3a8a",
        marginBottom: "30px",
    },

    circleContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "30px",
    },

    circle: {
        position: "relative",
        width: "200px",
        height: "200px",
    },

    circleText: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#1e3a8a",
    },

    statsRow: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "30px",
        flexWrap: "wrap",
    },

    statBox: {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "120px",
        boxShadow:
            "0 5px 15px rgba(0,0,0,0.08)",
    },

    attendanceCard: {
        background: "#2563eb",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        cursor: "pointer",
        width: "250px",
        margin: "30px auto 0",
    },
};