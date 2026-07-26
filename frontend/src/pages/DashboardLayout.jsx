import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem("username");

    const menuItems = [
        { name: "Dashboard", icon: "📊", path: "/dashboard" },
        { name: "Attendance", icon: "📅", path: "/attendance" },
        { name: "Profile", icon: "👤", path: "/profile" },
        { name: "Settings", icon: "⚙️", path: "/settings" },
    ];

    return (
        <div style={styles.layout}>
            {/* ===== SIDEBAR ===== */}
            <div
                style={{
                    ...styles.sidebar,
                    width: collapsed ? "80px" : "240px",
                }}
            >
                <div style={styles.logoSection}>
                    <h2 style={styles.logo}>
                        {collapsed ? "GF" : "GeoFace"}
                    </h2>
                </div>

                <div style={styles.menu}>
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <div
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                style={{
                                    ...styles.menuItem,
                                    background: active
                                        ? "rgba(255,255,255,0.15)"
                                        : "transparent",
                                }}
                            >
                                <span style={styles.icon}>{item.icon}</span>
                                {!collapsed && <span>{item.name}</span>}
                            </div>
                        );
                    })}
                </div>

                <div style={styles.bottomSection}>
                    <div
                        style={styles.menuItem}
                        onClick={() => {
                            localStorage.clear();
                            navigate("/");
                        }}
                    >
                        🚪 {!collapsed && "Logout"}
                    </div>

                    <div
                        style={styles.collapseBtn}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? "➡️" : "⬅️"}
                    </div>
                </div>
            </div>

            {/* ===== MAIN AREA ===== */}
            <div style={styles.main}>
                <div style={styles.topbar}>
                    <h3>Welcome, {username}</h3>
                </div>

                <div style={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;

/* ================== STYLES ================== */

const styles = {
    layout: {
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
    },

    sidebar: {
        background: "linear-gradient(180deg, #1e3a8a, #2563eb)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        padding: "20px 15px",
    },

    logoSection: {
        marginBottom: "30px",
        textAlign: "center",
    },

    logo: {
        fontWeight: "700",
    },

    menu: {
        flex: 1,
    },

    menuItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 15px",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "0.3s",
        marginBottom: "8px",
    },

    icon: {
        fontSize: "18px",
    },

    bottomSection: {
        marginTop: "auto",
    },

    collapseBtn: {
        marginTop: "15px",
        cursor: "pointer",
        textAlign: "center",
    },

    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },

    topbar: {
        background: "white",
        padding: "15px 30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },

    content: {
        padding: "30px",
    },
};