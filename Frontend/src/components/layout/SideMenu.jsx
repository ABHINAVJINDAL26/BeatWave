import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openAuthModal } from "../../Redux/Slices/uislices";

import { IoIosSettings } from "react-icons/io";
import logo from "../../assets/freepik__a-minimalist-logo-for-music-app-beatwave-combining__57176.png";
import "../../css/sidemenu/SideMenu.css";
import { CiUser } from "react-icons/ci";
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";

const SideMenu = ({ setView, view }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSettingsClick = () => {
    if (user) {
      dispatch(openAuthModal("editProfile"));
    } else {
      dispatch(openAuthModal("login"));
    }
  };

  const getNavBtnClass = (item) =>
    `sidemenu-nav-btn ${view === item ? "active" : ""}`;
  return (
    <>
      <aside className="sidemenu-root">
        {/* Logo */}
        <div className="sidemenu-header">
          <img src={logo} alt="wsa-logo" className="sidemenu-logo-img" />
          <h2 className="sidemenu-logo-title">BeatWave</h2>
        </div>
        {/* Navigation */}
        <nav className="sidemenu-nav" aria-label="Main navigation">
          <ul className="sidemenu-nav-list">
            <li>
              <button
                className={getNavBtnClass("home")}
                onClick={() => setView("home")}
              >
                <AiOutlineHome className="sidemenu-nav-icon" size={18} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!user) {
                    dispatch(openAuthModal("login"));
                  } else {
                    setView("search");
                  }
                }}
                className={getNavBtnClass("search")}
              >
                <AiOutlineSearch className="sidemenu-nav-icon" size={18} />
                <span> Search</span>
              </button>
            </li>
            <li>
              <button
                className={getNavBtnClass("favourite")}
                onClick={() => {
                  if (!user) {
                    dispatch(openAuthModal("login"));
                  } else {
                    setView("favourite");
                  }
                }}
              >
                <AiOutlineHeart size={18} />
                <span>My Favourite</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex-1"></div>
        <div className="sidemenu-profile-row">
          <div className="profile-placeholder">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="sidemenu-avatar-img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <CiUser size={30} />
            )}
          </div>

          <div className="sidemenu-username-wrapper">
            <div className="sidemenu-username">{user ? user.name : "Guest"}</div>
          </div>
          <div className="settings-container">
            <button type="button" className="sidemenu-settings-btn" onClick={handleSettingsClick}>
              <IoIosSettings size={20} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
