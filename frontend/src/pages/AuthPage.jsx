import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        employeeId: "",
        department: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            fullName: "",
            email: "",
            password: "",
            employeeId: "",
            department: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.post("/auth/login", {
                    email: form.email,
                    password: form.password,
                });

                // ✅ Admin Login
                if (res.data.role === "admin") {
                    localStorage.setItem(
                        "token",
                        res.data.token
                    );
                    localStorage.setItem(
                        "role",
                        "admin"
                    );

                    resetForm();
                    navigate("/admin");
                    return;
                }

                // ✅ Employee Login
                const { token, user, role } = res.data;

                if (!token || !user) {
                    alert("Invalid login response");
                    return;
                }

                localStorage.setItem(
                    "token",
                    token
                );
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
                localStorage.setItem(
                    "userId",
                    user._id
                );
                localStorage.setItem(
                    "username",
                    user.fullName
                );
                localStorage.setItem(
                    "role",
                    role
                );

                resetForm();
                navigate("/dashboard");
            } else {
                // ✅ Register

                const res = await api.post(
                    "/auth/register",
                    form
                );

                const userId =
                    res?.data?.userId ||
                    res?.data?.user?._id ||
                    res?.data?._id;

                if (!userId) {
                    alert(
                        "User ID not received from backend"
                    );
                    return;
                }

                localStorage.setItem(
                    "userId",
                    userId
                );

                resetForm();
                navigate("/face-register");
            }
        } catch (err) {
            alert(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', sans-serif;
                }

                .container {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #dbeafe, #ffffff);
                }

                .auth-wrapper {
                    width: 850px;
                    height: 520px;
                    background: white;
                    border-radius: 20px;
                    display: flex;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,255,0.15);
                }

                .left-panel {
                    width: 40%;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    text-align: center;
                }

                .left-panel button {
                    padding: 10px 25px;
                    border-radius: 25px;
                    border: 2px solid white;
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 20px;
                }

                .left-panel button:hover {
                    background: white;
                    color: #2563eb;
                }

                .right-panel {
                    width: 60%;
                    padding: 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .input-group {
                    position: relative;
                }

                .input-group input {
                    width: 100%;
                    padding: 12px 40px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    font-size: 14px;
                }

                .icon-left {
                    position: absolute;
                    top: 50%;
                    left: 12px;
                    transform: translateY(-50%);
                    color: #2563eb;
                }

                .icon-right {
                    position: absolute;
                    top: 50%;
                    right: 12px;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: #2563eb;
                }

                .submit-btn {
                    padding: 12px;
                    border-radius: 8px;
                    border: none;
                    background: #2563eb;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                }

                .submit-btn:disabled {
                    background: #93c5fd;
                    cursor: not-allowed;
                }
            `}</style>

            <div className="container">
                <div className="auth-wrapper">

                    <div className="left-panel">
                        <h2>
                            {isLogin
                                ? "Hello, Friend!"
                                : "Welcome Back!"}
                        </h2>

                        <p>
                            {isLogin
                                ? "Enter your details and start your journey."
                                : "Login with your personal info"}
                        </p>

                        <button
                            onClick={() =>
                                setIsLogin(!isLogin)
                            }
                        >
                            {isLogin
                                ? "Register"
                                : "Login"}
                        </button>
                    </div>

                    <div className="right-panel">
                        <h2>
                            {isLogin
                                ? "Login"
                                : "Create Account"}
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                        >
                            {!isLogin && (
                                <>
                                    <div className="input-group">
                                        <span className="icon-left">
                                            👤
                                        </span>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={
                                                form.fullName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <span className="icon-left">
                                            🆔
                                        </span>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            placeholder="Employee ID"
                                            value={
                                                form.employeeId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <span className="icon-left">
                                            🏢
                                        </span>
                                        <input
                                            type="text"
                                            name="department"
                                            placeholder="Department"
                                            value={
                                                form.department
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="input-group">
                                <span className="icon-left">
                                    📧
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <span className="icon-left">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Password"
                                    value={
                                        form.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                <span
                                    className="icon-right"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁"}
                                </span>
                            </div>

                            <button
                                className="submit-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : isLogin
                                        ? "Login"
                                        : "Register"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}