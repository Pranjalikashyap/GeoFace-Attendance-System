import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const FaceRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Fix: location.state se lo, nahi mile to localStorage se lo
    const userId =
        location.state?.userId || localStorage.getItem("userId");

    const videoRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!userId) {
            setMsg("User not found. Please login again.");
            return;
        }

        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => console.error(err));
    }, [userId]);

    const captureAndRegister = async () => {
        if (!userId) {
            setMsg("User not found. Please login again.");
            return;
        }

        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("image", blob, "face.jpg");
            formData.append("userId", userId);

            console.log("Sending userId:", userId);

            setLoading(true);
            setMsg("");

            try {
                await api.post("/face/register-face", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                setMsg("✅ Face registered successfully!");
                setTimeout(() => navigate("/"), 2000);
            } catch (err) {
                console.log(err.response?.data);
                setMsg(
                    err.response?.data?.message ||
                    "Face registration failed"
                );
            } finally {
                setLoading(false);
            }
        }, "image/jpeg");
    };

    return (
        <>
            <style>{`
        .wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #dbeafe, #ffffff);
        }

        .box {
          width: 850px;
          height: 520px;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          background: white;
          box-shadow: 0 20px 50px rgba(0,0,255,0.15);
        }

        .left {
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

        .right {
          width: 60%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        video {
          width: 320px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        button {
          padding: 12px 25px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        button:hover {
          background: #1e40af;
        }

        .msg {
          color: #2563eb;
          font-weight: bold;
        }
      `}</style>

            <div className="wrapper">
                <div className="box">
                    <div className="left">
                        <h2>Face Verification</h2>
                        <p>Register your face to enable secure login access.</p>
                    </div>

                    <div className="right">
                        <video ref={videoRef} autoPlay />

                        <button
                            onClick={captureAndRegister}
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register Face"}
                        </button>

                        {msg && <p className="msg">{msg}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FaceRegister;