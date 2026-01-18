import React, { useState, useRef, useMemo, useEffect } from "react";
import { Home, Search, AlignJustify,MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  lightModeIcon,
  darkModeIcon,
  reportBugIcon,
  redirectIcon,
  reelIcon,
  playgroundIcon,
  createIcon,
  chatgptIcon,
  discussionIcon,
} from "../utils/SvgIcons";
import { ClickAwayListener } from "@mui/material";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [lightMode, setLightMode] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");

  const sidebarItems = useMemo(
    () => [
      { icon: <Home />, text: "Home" },
      { icon: <Search />, text: "Search" },
      // { icon: reelIcon, text: "Reels" },
      { icon: <MessageCircle/>, text: "Messages" },
      { icon: playgroundIcon, text: "Playground" },
      { icon: createIcon, text: "Create" },
      { icon: discussionIcon, text: "Discuss" },
      { icon: <AlignJustify />, text: "More" },
    ],
    []
  );

  const moreItems = useMemo(
    () => [
      {
        icon: [lightModeIcon, darkModeIcon],
        text: ["Light Mode", "Dark Mode"],
      },
      { icon: reportBugIcon, text: "Report a problem" },
    ],
    []
  );

  const sidebarHandler = (textType) => {
    setShowRightSidebar(false);
    setShowMoreItems((prev) => (textType === "More" ? !prev : false));
    setSelectedItem(textType);

    if (textType === "Home") {
      navigate("/");
    } else if (textType === "Playground") {
      navigate("/playground");
    } else if (textType === "Messages") {
      navigate("/messages");
    } else if (textType === "Create") {
      navigate("/notes");
    } else if (textType === "Discuss") {
      navigate("/discuss");
    } else if (textType === "Reels") {
      navigate("/reels");
    } else if (textType === "Search") {
      setShowRightSidebar((prev) => !prev);
    }
  };

  return (
    <div className="relative px-4 border-r border-gray-300 w-[16%] h-screen flex flex-col">
      <h1
        className="text-2xl font-bold my-8 pl-3 cursor-pointer"
        style={{ fontFamily: "Instagram" }}
      >
        InstaCode
      </h1>

      {/* Main button aligned to Top */}
      <div className="flex-grow">
        {sidebarItems.slice(0, sidebarItems.length - 1).map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item.text)}
            className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 transition-transform duration-200 transform hover:scale-105"
          >
            {React.cloneElement(item.icon, {
              className: `w-5 h-5 ${
                selectedItem === item.text ? "text-white" : "text-gray-400"
              }`,
            })}
            <span
              className={`${selectedItem === item.text ? "font-bold" : ""}`}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* More button aligned to bottom */}
      <div className="mb-4">
        <div
          onClick={() => sidebarHandler("More")}
          className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 transition-transform duration-200 transform hover:scale-105"
        >
          {React.cloneElement(sidebarItems[sidebarItems.length - 1].icon, {
            className: "w-5 h-5",
          })}
          <span>{sidebarItems[sidebarItems.length - 1].text}</span>
        </div>
      </div>

      {showRightSidebar && (
        <div className="absolute left-[100%] w-[300px] h-screen bg-white shadow-lg border border-gray-300 z-50">
          <SearchSideBar setShowRightSidebar={setShowRightSidebar} />
        </div>
      )}

      {showMoreItems && (
        <ClickAwayListener onClickAway={() => setShowMoreItems(false)}>
          <div className="absolute bottom-20 w-[250px] bg-gray-100 text-gray-700 shadow-lg z-50 rounded-2xl">
            <div className="p-2">
              {moreItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => index === 0 && setLightMode(!lightMode)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  {React.cloneElement(
                    index === 0
                      ? lightMode
                        ? item.icon[0]
                        : item.icon[1]
                      : item.icon,
                    { className: "w-5 h-5 text-gray-500" }
                  )}
                  <span>
                    {index === 0
                      ? lightMode
                        ? item.text[0]
                        : item.text[1]
                      : item.text}
                  </span>
                </div>
              ))}
            </div>
            <hr className="border-t border-2 border-gray-200" />
            <div className="p-2">
              <a
                href="https://leetcode.com/assessment/"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                {redirectIcon}
                <span>Assessment</span>
              </a>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

const SearchSideBar = ({ setShowRightSidebar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState([{}]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Retrieve search history from localStorage on component mount
    const storedSearches = JSON.parse(
      localStorage.getItem("recentSearches")
    ) || [{}];
    setRecentSearches(storedSearches);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm) {
      navigate(`/${searchTerm}`);
      setSearchTerm("");
      inputRef.current?.blur();
      setShowRightSidebar(false);
    }
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <ClickAwayListener onClickAway={() => setShowRightSidebar(false)}>
      <div className="h-full p-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-semibold">Search</h2>
        </div>
        <input
          ref={inputRef}
          className="w-full px-4 py-2 rounded-md mb-6 bg-gray-100 outline-none"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          autoFocus
        />
        <div className="flex justify-between mb-4 border-t pt-4">
          <h3 className="text-base font-medium">Recent</h3>
          <h3
            className="text-base font-medium text-cyan-400 cursor-pointer hover:text-cyan-200"
            onClick={handleClearAll}
          >
            Clear all
          </h3>
        </div>
        <div
          className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none", // for Firefox
          }}
        >
          {/* TO-DO - fix delete text while hover to X */}
          {recentSearches.map((term, index) => (
            <SearchedItemContainer
              setShowRightSidebar={setShowRightSidebar}
              inputRef={inputRef}
              setSearchTerm={setSearchTerm}
              navigate={navigate}
              key={index}
              term={term}
              recentSearches={recentSearches}
              setRecentSearches={setRecentSearches}
            />
          ))}
        </div>
      </div>
    </ClickAwayListener>
  );
};

const SearchedItemContainer = ({
  navigate,
  setSearchTerm,
  inputRef,
  setShowRightSidebar,
  term,
  recentSearches,
  setRecentSearches,
}) => {
  const handleItemClick = () => {
    navigate(`/${term.username}`);
    setSearchTerm("");
    inputRef.current?.blur();
    setShowRightSidebar(false);
  };

  const handleDelete = () => {
    const updatedSearches = recentSearches.filter(
      (search) => search.username !== term.username
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  return (
    <div
      onClick={handleItemClick}
      className="flex justify-between items-center p-3 rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <img
          src={term.userAvatar}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium">{term.username}</p>
          <p className="text-sm text-gray-500">
            {term.realName} • {term.reputation}
          </p>
        </div>
      </div>
      <div className="relative group">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleDelete}
        >
          ✕
        </button>
        <span className="text-center absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-gray-300 text-white text-xs rounded-md">
          Delete
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
