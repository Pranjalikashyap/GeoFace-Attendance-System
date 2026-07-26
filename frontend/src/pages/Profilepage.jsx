import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        department: "",
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
            setUser(storedUser);
            setFormData({
                fullName: storedUser.fullName,
                department: storedUser.department,
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `http://localhost:8080/api/user/update/${user._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedUser = {
                ...user,
                fullName: res.data.user.fullName,
                department: res.data.user.department,
            };

            setUser(updatedUser);

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            localStorage.setItem(
                "username",
                updatedUser.fullName
            );

            alert("Profile Updated Successfully ✅");

            setEditMode(false);
        } catch (err) {
            console.log(err);
            alert("Profile Update Failed");
        }
    };

    if (!user) {
        return (
            <p style={{ textAlign: "center" }}>
                Loading...
            </p>
        );
    }

    const initials = user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>

                <div style={styles.avatar}>
                    {initials}
                </div>

                {editMode ? (
                    <>
                        <input
                            style={styles.input}
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                        <input
                            style={styles.input}
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </>
                ) : (
                    <>
                        <h2 style={styles.name}>
                            {user.fullName}
                        </h2>

                        <p style={styles.role}>
                            {user.department} Department
                        </p>
                    </>
                )}

                <div style={styles.infoSection}>

                    <div style={styles.infoRow}>
                        <span style={styles.label}>
                            Email
                        </span>

                        <span style={styles.value}>
                            {user.email}
                        </span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.label}>
                            Employee ID
                        </span>

                        <span style={styles.value}>
                            {user.employeeId}
                        </span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.label}>
                            Face Registered
                        </span>

                        <span style={styles.value}>
                            {user.faceRegistered
                                ? "✅ Yes"
                                : "❌ No"}
                        </span>
                    </div>

                </div>

                {editMode ? (
                    <div style={styles.buttonGroup}>
                        <button
                            style={styles.saveBtn}
                            onClick={handleSave}
                        >
                            Save
                        </button>

                        <button
                            style={styles.cancelBtn}
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        style={styles.editBtn}
                        onClick={() => setEditMode(true)}
                    >
                        Edit Profile
                    </button>
                )}

            </div>
        </div>
    );
}

const styles = {

    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        background: "#f3f4f6",
    },

    card: {
        width: "450px",
        background: "#fff",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        textAlign: "center",
    },

    avatar: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "#2563eb",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "35px",
        fontWeight: "bold",
        margin: "0 auto 20px",
    },

    name: {
        marginBottom: "5px",
    },

    role: {
        color: "#666",
        marginBottom: "25px",
    },

    infoSection: {
        textAlign: "left",
        marginBottom: "20px",
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #eee",
    },

    label: {
        fontWeight: "600",
    },

    value: {
        color: "#555",
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "15px",
    },

    editBtn: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
    },

    buttonGroup: {
        display: "flex",
        gap: "10px",
    },

    saveBtn: {
        flex: 1,
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "#16a34a",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
    },

    cancelBtn: {
        flex: 1,
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "#ef4444",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
    },
};