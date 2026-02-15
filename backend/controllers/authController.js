import User from "../model/userModel.js";
import imageKit from "../config/imageKit.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sendMail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";

dotenv.config();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};

const signup = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, emailID and password are required" });
            return;
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        let avatarUrl = "";
        if (avatar) {
            try {
                const uploadResponse = await imageKit.upload({
                    file: avatar,
                    fileName: `avatar_${Date.now()}.jpg`,
                    folder: "/mern-music-player",
                });
                avatarUrl = uploadResponse.url;
            } catch (uploadError) {
                console.error("Avatar upload failed:", uploadError.message);
                // Continue without avatar or handle error? For now continuing.
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarUrl,
        });

        const token = createToken(user._id);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
        });

    } catch (err) {
        console.error("Signup error in controller:", err);
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        })
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
}

//protected contoller

const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        favorites: req.user.favorites || []
    };
    res.status(200).json({ user });
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "email id doesn't exist" });
        }
        //generate reset token 
        const resetToken = crypto.randomBytes(20).toString("hex");
        //hash the reset token before saving to database
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 min

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        //send an email to user with reset url

        await sendMail({
            to: user.email,
            subject: "Password Reset Request",
            html:
                `<h3>Password Reset Request</h3>
            <p>You have requested a password reset. Please click the link below to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in 10 minutes.</p>
            `

        })
        res.status(200).json({ message: "Password reset email sent" });
    } catch (err) {
        console.error("Error sending password reset email:", err.message);
        res.status(500).json({ message: "Error sending password reset email" });
    }
}

// reset password 
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Error resetting password:", err.message);
        res.status(500).json({ message: "Error resetting password" });
    }
}

// edit profile

const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, email, avatar, currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (currentPassword || newPassword) {
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: "Both current and new password are required to change password" });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "New password must be at least 6 characters long" });
            }
            user.password = newPassword;
        }
        if (avatar) {
            const uplpoadResponse = await imageKit.upload({
                file: avatar,
                fileName: `avatar_${Date.now()}.jpg`,
                folder: "/mern-music-player",
            });
            user.avatar = uplpoadResponse.url;
        }
        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                favorites: user.favorites || []
            },
        });
    } catch (err) {
        console.error("Error editing profile:", err.message);
        res.status(500).json({ message: "Error editing profile" });
    }
}

// toggle favorite
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user._id;
        const { song } = req.body; // song object

        if (!song || !song.id) {
            return res.status(400).json({ message: "Invalid song data" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if song is already in favorites
        const existingIndex = user.favorites.findIndex((fav) => fav.id == song.id);

        if (existingIndex > -1) {
            // Remove
            user.favorites.splice(existingIndex, 1);
        } else {
            // Add (map to schema fields)
            user.favorites.push({
                id: song.id,
                name: song.name,
                artistName: song.artist_name || song.artistName,
                Image: song.cover || song.image || song.Image,
                durarion: song.duration || song.durarion,
                Audio: song.audioSrc || song.Audio,
            });
        }

        await user.save();

        res.status(200).json({
            message: "Favorites updated",
            favorites: user.favorites,
        });

    } catch (err) {
        console.error("Error toggling favorite:", err);
        res.status(500).json({ message: "Error updating favorites" });
    }
}

export { signup, login, getMe, forgotPassword, resetPassword, editProfile, toggleFavorite };
