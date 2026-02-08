import React from "react";

import Auth from "../auth/Auth";
import Playlist from "../player/Playlist";
import SearchBar from "../search/SearchBar";
import SongList from "../player/SongList";
import SongGrid from "../songs/SongGrid";

import "../../css/mainArea/MainArea.css";

const MainArea = ({ view, songs }) => {
  return (
    <div className="mainarea-root">
      <div className="mainarea-top">
        <Auth />
        {view === "home" && <Playlist />}
        {view === "search" && <SearchBar />}
      </div>

      <div className="mainarea-scroll">
        {(view === "home" || view === "search") && <SongList songs={songs} />}

        {view === "favourite" && <SongGrid songs={songs} />}
      </div>
    </div>
  );
};

export default MainArea;
