import React, { useState } from "react";

import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";

import "../css/pages/HomePage.css";

const Homepage = () => {
  const [view, setView] = useState("home");
  const songs = [
    {
      id: 1,
      name: "Believer",
      artist_name: "Imagine Dragons",
      cover: "https://i.scdn.co/image/ab67616d0000b273a466c9d6c7a3c7bbdc0e87f3",
      releasedate: "2017-02-01",
      duration: "04.30",
    },
    {
      id: 2,
      name: "Faded",
      artist_name: "Alan Walker",
      cover: "https://i.scdn.co/image/ab67616d0000b2733c6c8b9a43d1d93e4aaf0e65",
      releasedate: "2015-12-03",
      duration: "05.30",
    },
    {
      id: 3,
      name: "Shape of You",
      artist_name: "Ed Sheeran",
      cover: "https://i.scdn.co/image/ab67616d0000b273ba0e0bdfd8f5b1dc3c6d1c8e",
      releasedate: "2017-03-17",
      duration: "04.32",
    },
  ];

  return (
    <div className="homepage-root">
      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu setView={setView} view={view} />
        </div>
        {/* Main Content */}
        <div className="homepage-content">
          <MainArea view={view} songs={songs} />
        </div>
      </div>
      {/* Footer Player */}
      <Footer />
    </div>
  );
};

export default Homepage;
