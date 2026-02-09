import React, { useState } from "react";
import "../../css/auth/Input.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="input-wrapper">
            <label>{label}</label>
            <div className="input-container">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="input-field"
                />
                {type === "password" && (
                    <button type="button" className="input-eye-btn" onClick={togglePassword}>
                        {showPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;