import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import useAudioPlayer from "../Hooks/useAudioPlayer";
import "../css/pages/HomePage.css";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const songs = [
    {
      id: 1,
      name: "Believer",
      artist_name: "Imagine Dragons",
      cover: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&h=300&fit=crop",
      releasedate: "2017-02-01",
      duration: "04.30",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      category: "Rock",
    },
    {
      id: 2,
      name: "Faded",
      artist_name: "Alan Walker",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      releasedate: "2015-12-03",
      duration: "05.30",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      category: "Chill",
    },
    {
      id: 3,
      name: "Shape of You",
      artist_name: "Ed Sheeran",
      cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop",
      releasedate: "2017-03-17",
      duration: "04.32",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      category: "Happy",
    },
    {
      id: 4,
      name: "Mockingbird",
      artist_name: "Eminem",
      cover: "https://images.unsplash.com/photo-1549213821-4708d624e1d1?w=300&h=300&fit=crop",
      releasedate: "2005-04-25",
      duration: "04.11",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      category: "Workout",
    },
    {
      id: 5,
      name: "River Flows in You",
      artist_name: "Yiruma",
      cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop",
      releasedate: "2001-12-01",
      duration: "03.08",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      category: "Relaxing",
    }
  ];

  // 1. Home View Songs (Category based)
  const homeSongs = songs.filter(song =>
    selectedCategory === "All" || song.category === selectedCategory
  );

  // 2. Search View Songs (Search term based)
  const searchSongs = songs.filter(song =>
    searchTerm && (
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCategorySelect = (category) => {
    // Toggle category (click again to reset)
    if (selectedCategory === category) {
      setSelectedCategory("All");
    } else {
      setSelectedCategory(category);
    }
  };

  const { user } = useSelector((state) => state.auth);

  // Search History State
  const [searchHistory, setSearchHistory] = useState([]);

  // Load history when user changes
  useEffect(() => {
    const userId = user?.id || user?._id;
    const historyKey = userId ? `searchHistory_${userId}` : "searchHistory_guest";
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const addToHistory = (term) => {
    setSearchHistory((prev) => {
      const newHistory = [term, ...prev.filter((t) => t !== term)].slice(0, 10);
      const userId = user?.id || user?._id;
      const historyKey = userId ? `searchHistory_${userId}` : "searchHistory_guest";
      localStorage.setItem(historyKey, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const removeFromHistory = (term) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter((t) => t !== term);
      const userId = user?.id || user?._id;
      const historyKey = userId ? `searchHistory_${userId}` : "searchHistory_guest";
      localStorage.setItem(historyKey, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // Normalize favorites
  const normalizedFavorites = useMemo(() => {
    if (!user || !user.favorites) return [];
    return user.favorites.map(fav => ({
      id: fav.id,
      name: fav.name,
      artist_name: fav.artistName, // Map backend camelCase to expected snake_case
      cover: fav.Image,            // Map Image to cover
      duration: fav.durarion,      // Map durarion to duration
      audioSrc: fav.Audio,         // Map Audio to audioSrc
      releasedate: "-",            // Default generic date
      category: "Favorite"
    }));
  }, [user]);

  // Determine which list is active
  let activeSongs;
  if (view === "favourite") {
    activeSongs = normalizedFavorites;
  } else if (view === "search") {
    activeSongs = searchSongs;
  } else {
    activeSongs = homeSongs;
  }

  const player = useAudioPlayer(activeSongs.length > 0 ? activeSongs : []);

  return (
    <div className="homepage-root">
      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu setView={setView} view={view} />
        </div>
        {/* Main Content */}
        <div className="homepage-content">
          <MainArea
            view={view}
            songs={activeSongs} // Pass the CORRECT list
            onSongSelect={player.playSongAtIndex}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            onSearch={addToHistory}
            searchHistory={searchHistory}
            onRemoveHistory={removeFromHistory}
          />
        </div>
      </div>
      {/* Footer Player */}
      <Footer player={player} />
    </div>
  );
};

export default Homepage;
