import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateFavoriteSongs, logout } from "../../Redux/Slices/authslice";

import SongDetail from "../player/SongDetail";
import ControlArea from "../player/ControlArea";
import Features from "../player/Features";

import "../../css/footer/Footer.css";

const Footer = ({ player }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const currentSong = player?.currentSong;

  const isLiked = useMemo(() => {
    if (!user || !user.favorites || !currentSong) return false;
    const isFav = user.favorites.some((fav) => fav.id == currentSong.id);
    return isFav;
  }, [user, currentSong]);

  if (!player) return null;

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffleEnabled,
    loopEnabled,
    playbackSpeed,
    audioRef,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    handleToggleMute,
    handleToggleShuffle,
    handleToggleLoop,
    handleSetPlaybackSpeed,
    handleVolumeChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  } = player;

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like songs");
      return;
    }

    try {
      // Optimistic UI update could go here, but for now wait for API
      console.log("Token being sent:", token); // DEBUG
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/favorites`,
        { song: currentSong },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.favorites) {
        dispatch(updateFavoriteSongs(res.data.favorites));
      }
    } catch (error) {
      console.error("Error liking song:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
        dispatch(logout());
      }
    }
  };

  return (
    <footer className="footer-root footer-glow">
      <audio
        ref={audioRef}
        src={currentSong?.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <SongDetail currentSong={currentSong} />

      <ControlArea
        isPlaying={isPlaying}
        onPlayPause={handleTogglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onLike={handleLike}
        isLiked={isLiked}
      />

      <Features
        isMuted={isMuted}
        volume={volume}
        shuffleEnabled={shuffleEnabled}
        loopEnabled={loopEnabled}
        playbackSpeed={playbackSpeed}
        onToggleMute={handleToggleMute}
        onToggleShuffle={handleToggleShuffle}
        onToggleLoop={handleToggleLoop}
        onSetPlaybackSpeed={handleSetPlaybackSpeed}
        onVolumeChange={handleVolumeChange}
      />
    </footer>
  );
};

export default Footer;
