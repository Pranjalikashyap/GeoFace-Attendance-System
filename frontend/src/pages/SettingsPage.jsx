import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SettingsPage = () => {
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            setProfile({
                fullName: user.fullName || "",
                email: user.email || "",
            });
        }
    }, []);

    useEffect(() => {
        document.body.style.background = darkMode
            ? "#111827"
            : "#f3f4f6";
    }, [darkMode]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        try {
            const res = await api.put(
                `/users/profile/${user._id}`,
                profile
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            alert("Profile Updated Successfully ✅");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Profile update failed"
            );
        }
    };

    const handleUpdatePassword = async () => {
        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {
            return alert("Passwords do not match ❌");
        }

        try {
            await api.put(
                `/users/change-password/${user._id}`,
                passwords
            );

            alert("Password Updated Successfully ✅");

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Password update failed"
            );
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div
            style={{
                ...styles.container,
                background: darkMode
                    ? "#111827"
                    : "#f3f4f6",
                color: darkMode ? "#fff" : "#000",
            }}
        >
            <h1
                style={{
                    ...styles.pageTitle,
                    color: darkMode
                        ? "#fff"
                        : "#1e3a8a",
                }}
            >
                ⚙️ Account Settings
            </h1>

            {/* PROFILE */}
            <div
                style={{
                    ...styles.card,
                    background: darkMode
                        ? "#1f2937"
                        : "#fff",
                }}
            >
                <h2>👤 Profile</h2>

                <div style={styles.profileRow}>
                    <img
                        src={
                            profileImage ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="profile"
                        style={styles.profileImage}
                    />

                    <input
                        type="file"
                        onChange={handleImageUpload}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Name</label>

                    <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                fullName:
                                    e.target.value,
                            })
                        }
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Email</label>

                    <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                email:
                                    e.target.value,
                            })
                        }
                        style={styles.input}
                    />
                </div>

                <button
                    style={styles.saveBtn}
                    onClick={handleSaveProfile}
                >
                    Save Profile
                </button>
            </div>

            {/* PASSWORD */}
            <div
                style={{
                    ...styles.card,
                    background: darkMode
                        ? "#1f2937"
                        : "#fff",
                }}
            >
                <h2>🔐 Change Password</h2>

                <div style={styles.formGroup}>
                    <label>
                        Current Password
                    </label>

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        value={
                            passwords.currentPassword
                        }
                        onChange={(e) =>
                            setPasswords({
                                ...passwords,
                                currentPassword:
                                    e.target.value,
                            })
                        }
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>New Password</label>

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        value={
                            passwords.newPassword
                        }
                        onChange={(e) =>
                            setPasswords({
                                ...passwords,
                                newPassword:
                                    e.target.value,
                            })
                        }
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>
                        Confirm Password
                    </label>

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        value={
                            passwords.confirmPassword
                        }
                        onChange={(e) =>
                            setPasswords({
                                ...passwords,
                                confirmPassword:
                                    e.target.value,
                            })
                        }
                        style={styles.input}
                    />
                </div>

                <div style={styles.checkboxRow}>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                    />
                    <span>Show Password</span>
                </div>

                <button
                    style={styles.saveBtn}
                    onClick={
                        handleUpdatePassword
                    }
                >
                    Update Password
                </button>
            </div>

            {/* APP SETTINGS */}
            <div
                style={{
                    ...styles.card,
                    background: darkMode
                        ? "#1f2937"
                        : "#fff",
                }}
            >
                <h2>⚡ App Preferences</h2>

                <div style={styles.toggleRow}>
                    <span>🌙 Dark Mode</span>

                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() =>
                            setDarkMode(!darkMode)
                        }
                    />
                </div>
            </div>

            {/* LOGOUT */}
            <div style={styles.logoutBox}>
                <button
                    style={styles.logoutBtn}
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;

const styles = {
    container: {
        minHeight: "100vh",
        padding: "30px",
        maxWidth: "900px",
        margin: "auto",
    },

    pageTitle: {
        textAlign: "center",
        marginBottom: "30px",
    },

    card: {
        padding: "30px",
        borderRadius: "20px",
        boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        marginBottom: "25px",
    },

    profileRow: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px",
    },

    profileImage: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        objectFit: "cover",
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "15px",
    },

    input: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
    },

    checkboxRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "15px",
    },

    saveBtn: {
        width: "100%",
        padding: "12px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
    },

    toggleRow: {
        display: "flex",
        justifyContent: "space-between",
    },

    logoutBox: {
        textAlign: "center",
        marginTop: "30px",
    },

    logoutBtn: {
        padding: "12px 40px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
    },
};