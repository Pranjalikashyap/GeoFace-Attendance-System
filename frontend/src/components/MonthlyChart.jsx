import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

const MonthlyChart = ({ userId }) => {

    const [data, setData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const res = await axios.get(
                    `http://localhost:8080/api/attendance/monthly/${userId}`
                );

                setData(res.data);

            } catch (err) {
                console.log(err);
            }

        };

        if (userId) fetchData();

    }, [userId]);



    if (data.length === 0) {

        return (
            <div style={styles.empty}>
                No attendance data available
            </div>
        );

    }



    return (

        <div style={styles.card}>

            <h3 style={styles.title}>
                📊 Monthly Attendance Overview
            </h3>

            <ResponsiveContainer width="100%" height={320}>

                <BarChart data={data} barSize={50}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="present"
                        fill="#22c55e"
                        radius={[10, 10, 0, 0]}
                    />

                    <Bar
                        dataKey="absent"
                        fill="#ef4444"
                        radius={[10, 10, 0, 0]}
                    />

                    <Bar
                        dataKey="leave"
                        fill="#facc15"
                        radius={[10, 10, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

};

export default MonthlyChart;



const styles = {

    card: {

        background: "white",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
        marginTop: "30px",
        width: "100%",
        maxWidth: "850px",
        margin: "auto"

    },

    title: {

        textAlign: "center",
        marginBottom: "25px",
        color: "#1e3a8a",
        fontSize: "20px",
        fontWeight: "600"

    },

    empty: {

        padding: "20px",
        background: "white",
        borderRadius: "10px",
        textAlign: "center",
        marginTop: "30px"

    }

};