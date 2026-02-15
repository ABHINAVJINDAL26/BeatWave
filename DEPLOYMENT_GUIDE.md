# 🚀 BeatWave Deployment Guide

This guide will help you deploy your full-stack MERN application (BeatWave) to the web.

We will use:
-   **Backend**: [Render](https://render.com) (Free tier available)
-   **Frontend**: [Vercel](https://vercel.com) (Free tier available) or [Netlify](https://netlify.com)
-   **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (You likely already have this set up)

---

## Part 1: Backend Deployment (Render)

1.  **Sign Up/Login**: Go to [dashboard.render.com](https://dashboard.render.com) and log in with GitHub.
2.  **New Web Service**: Click "New +" button -> "Web Service".
3.  **Connect Repo**: Select your repository `ABHINAVJINDAL26/BeatWave`.
4.  **Configuration**:
    -   **Name**: `beatwave-backend` (or similar)
    -   **Region**: Closest to you (e.g., Singapore or Frankfurt)
    -   **Branch**: `main`
    -   **Root Directory**: `backend` (Important!)
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
5.  **Environment Variables**:
    Scroll down to "Environment Variables" and add these from your local `.env`:
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: Any secret string (e.g., `mysecretkey123`).
    -   `IMAGEKIT_PUBLIC_KEY`: (From your ImageKit account)
    -   `IMAGEKIT_PRIVATE_KEY`: (From your ImageKit account)
    -   `IMAGEKIT_URL_ENDPOINT`: (From your ImageKit account)
    -   `FRONTEND_URL`: Leave blank for now, come back and update this AFTER deploying Frontend (Part 2).
6.  **Deploy**: Click "Create Web Service".
7.  **Copy URL**: Once deployed, copy the backend URL (e.g., `https://beatwave-backend.onrender.com`).

---

## Part 2: Frontend Deployment (Vercel)

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com) and log in with GitHub.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repo**: Import `ABHINAVJINDAL26/BeatWave`.
4.  **Framework Preset**: Select **Vite**.
5.  **Root Directory**: Click "Edit" and select `Frontend`.
6.  **Build Settings**:
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
    -   **Install Command**: `npm install`
7.  **Environment Variables**:
    -   **Key**: `VITE_BASE_URL`
    -   **Value**: Paste your **Backend URL** from Part 1 (e.g., `https://beatwave-backend.onrender.com`).
    -   *Note: Do NOT add a trailing slash `/` at the end.*
8.  **Deploy**: Click "Deploy".
9.  **Copy URL**: Once deployed, copy the frontend URL (e.g., `https://beatwave-frontend.vercel.app`).

---

## Part 3: Final Connection (CORS)

1.  Go back to your **Render Dashboard** (Backend).
2.  Go to "Environment Variables".
3.  Add/Update `FRONTEND_URL` with your **Vercel Frontend URL** (e.g., `https://beatwave-frontend.vercel.app`).
4.  **Save Changes**: Render will redeploy automatically.

---

## ✅ Deployment Complete!

Your internal full-stack music player is now live!
-   Open the Vercel URL to use the app.
-   Test Signup, Login, and Music Playback.
