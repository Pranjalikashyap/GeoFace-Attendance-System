import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersRes = await axios.get(
                "http://localhost:8080/api/admin/users"
            );

            const statsRes = await axios.get(
                "http://localhost:8080/api/admin/stats"
            );

            setUsers(usersRes.data.users || []);

            setStats(statsRes.data);

        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this employee?")) return;

        try {
            await axios.delete(
                `http://localhost:8080/api/admin/user/${id}`
            );

            alert("Employee Deleted Successfully");

            fetchUsers();

        } catch (err) {
            console.log(err);
        }
    };

    const handleBlock = async (id) => {
        try {
            const res = await axios.put(
                `http://localhost:8080/api/admin/block/${id}`
            );

            alert(res.data.message);

            fetchUsers();

        } catch (err) {
            console.log(err);
        }
    };

    const handleView = (user) => {
        setSelectedUser(user);
    };

    const filteredUsers = (users || []).filter((user) =>
        user.fullName
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div style={styles.container}>

            <h1 style={styles.heading}>
                Admin Dashboard
            </h1>

            <div style={styles.cards}>

                <div style={styles.card}>
                    <div>
                        <h2 style={styles.number}>
                            {stats.total}
                        </h2>
                        <p>Total Employees</p>
                    </div>

                    <span style={styles.icon}>👥</span>
                </div>

                <div style={styles.card}>
                    <div>
                        <h2 style={styles.number}>
                            {stats.present}
                        </h2>
                        <p>Present Today</p>
                    </div>

                    <span style={styles.icon}>✅</span>
                </div>

                <div style={styles.card}>
                    <div>
                        <h2 style={styles.number}>
                            {stats.absent}
                        </h2>
                        <p>Absent Today</p>
                    </div>

                    <span style={styles.icon}>❌</span>
                </div>

            </div>

            <div style={styles.searchBox}>

                <input
                    type="text"
                    placeholder="Search Employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />

            </div>

            <div style={styles.tableBox}>

                <table style={styles.table}>

                    <thead>

                        <tr>
                            <th style={styles.th}>Employee</th>
                            <th style={styles.th}>Employee ID</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Account</th>
                            <th style={styles.th}>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredUsers.map((user) => (

                            <tr key={user._id}>

                                <td style={styles.td}>
                                    {user.fullName}
                                </td>

                                <td style={styles.td}>
                                    {user.employeeId}
                                </td>

                                <td style={styles.td}>
                                    {user.email}
                                </td>

                                <td style={styles.td}>
                                    {user.department}
                                </td>

                                <td style={styles.td}>

                                    <span
                                        style={{
                                            background: user.isActive
                                                ? "#dcfce7"
                                                : "#fee2e2",

                                            color: user.isActive
                                                ? "#15803d"
                                                : "#dc2626",

                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            fontWeight: "600",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {user.isActive
                                            ? "Active"
                                            : "Blocked"}
                                    </span>

                                </td>

                                <td style={styles.td}>

                                    <button
                                        style={styles.viewBtn}
                                        onClick={() =>
                                            handleView(user)
                                        }
                                    >
                                        View
                                    </button>

                                    <button
                                        style={styles.blockBtn}
                                        onClick={() =>
                                            handleBlock(user._id)
                                        }
                                    >
                                        {user.isActive
                                            ? "Block"
                                            : "Unblock"}
                                    </button>

                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() =>
                                            handleDelete(user._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {selectedUser && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>

                        <h2 style={{ marginBottom: 20 }}>
                            Employee Details
                        </h2>

                        <p><b>Name :</b> {selectedUser.fullName}</p>

                        <p><b>Employee ID :</b> {selectedUser.employeeId}</p>

                        <p><b>Email :</b> {selectedUser.email}</p>

                        <p><b>Department :</b> {selectedUser.department}</p>

                        <p>
                            <b>Account :</b>{" "}
                            {selectedUser.isActive ? "🟢 Active" : "🔴 Blocked"}
                        </p>

                        <button
                            style={styles.closeBtn}
                            onClick={() => setSelectedUser(null)}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "40px",
    },

    heading: {
        color: "#1e3a8a",
        fontSize: "34px",
        fontWeight: "700",
        marginBottom: "30px",
    },

    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px",
        marginBottom: "30px",
    },

    card: {
        background: "#fff",
        borderRadius: "18px",
        padding: "25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 25px rgba(0,0,0,.08)",
        transition: ".3s",
    },

    number: {
        fontSize: "34px",
        color: "#2563eb",
        fontWeight: "700",
        marginBottom: "5px",
    },

    icon: {
        fontSize: "42px",
    },

    searchBox: {
        marginBottom: "25px",
    },

    searchInput: {
        width: "340px",
        padding: "13px 18px",
        borderRadius: "30px",
        border: "1px solid #d1d5db",
        outline: "none",
        fontSize: "15px",
        background: "#fff",
    },

    tableBox: {
        background: "#fff",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(0,0,0,.08)",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    th: {
        background: "#2563eb",
        color: "#fff",
        padding: "16px",
        textAlign: "left",
        fontSize: "15px",
    },

    td: {
        padding: "16px",
        borderBottom: "1px solid #eee",
        fontSize: "14px",
    },

    viewBtn: {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "8px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        marginRight: "8px",
        fontWeight: "600",
    },

    blockBtn: {
        background: "#f59e0b",
        color: "#fff",
        border: "none",
        padding: "8px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        marginRight: "8px",
        fontWeight: "600",
    },

    deleteBtn: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "8px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },

        modal: {
            width: "420px",
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
            lineHeight: "35px",
        },

        closeBtn: {
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
        },
    },
};