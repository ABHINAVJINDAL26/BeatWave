import React, { useState } from "react";
import Input from "../Common/input";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import axios from "axios";
import { setLoading, setuser, setError, clearError } from "../../Redux/Slices/authslice";
import { closeAuthModal, switchAuthMode } from "../../Redux/Slices/uislices";
import "../../css/auth/Login.css";

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const dispatch = useDispatch();

    const { isLoading, error } = useSelector((state) => state.auth);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        if (!validator.isEmail(email)) {
            dispatch(setError("Please enter a valid email address"));
            return;
        }

        if (!password) {
            dispatch(setError("Please enter a password"));
            return;
        }

        dispatch(setLoading(true));
        try {
            const res = await axios.post("/api/auth/login", { email, password });
            const data = res.data || {};

            dispatch(
                setuser({
                    user: data.user,
                    token: data.token,
                })
            );

            localStorage.setItem("token", data.token);
            dispatch(closeAuthModal());
            console.log("Login Successfull");
        } catch (error) {
            const servermessage = error?.response?.data?.message ||
                error?.response?.data?.error;
            dispatch(setError(servermessage || "Login Failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="login-wrapper">
            <h3 className="login-title">Welcome Back</h3>
            <p className="login-subtitle">Please Enter your detail to login</p>

            <form className="login-form" onSubmit={handleLogin}>
                <Input
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                />
                <Input
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                />

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="login-submit-btn" disabled={isLoading}>
                    <span>{isLoading ? "Logging In..." : "Login"}</span>
                </button>

                <div className="login-switch-wrapper" style={{ marginTop: "1rem", textAlign: "center" }}>
                    <p style={{ color: "#9ca3af" }}>
                        Don&apos;t have an account? {" "}
                        <span
                            onClick={() => dispatch(switchAuthMode("signup"))}
                            style={{ cursor: "pointer", color: "#a855f7", fontWeight: "bold" }}
                        >
                            Signup
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;