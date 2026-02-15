import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/auth/Resetpass.css";
import "../../css/auth/Input.css"; // Fixed path based on file structure
import Input from "../Common/input";

const Resetpass = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(""); // 'error' | 'success' | 'info' | ''

    const handleReset = async () => {
        if (!password || password.length < 6) {
            setStatus("error");
            setMessage("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            setStatus("info");
            setMessage("Resetting Password...");

            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`, {
                token,
                password,
            });

            setStatus("success");
            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setStatus("error");
            setMessage(error?.response?.data?.message || "Failed to reset password");
            setLoading(false);
        }
    }

    return (
        <div className="reset-wrapper">
            <h3 className="reset-title">Reset Password</h3>
            <p className="reset-subtitle">Enter your new password to regain access to your account</p>

            <div className="reset-form">
                <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {status && <div className={`reset-message ${status}`}>{message}</div>}

                <button
                    className="reset-submit-bttn"
                    onClick={handleReset}
                    disabled={loading}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </div>
        </div>
    );
};


export default Resetpass;