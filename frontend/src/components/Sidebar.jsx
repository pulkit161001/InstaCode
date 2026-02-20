import React, { useState, useRef, useMemo, useEffect } from "react";
import { Home, Search, AlignJustify,MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { themeAtom } from "../atoms/themeAtom";
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
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [selectedItem, setSelectedItem] = useState("Home");
  const isLightMode = theme === "light";

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

  const sidebarClass = `relative px-4 border-r w-[16%] h-screen flex flex-col ${
    isLightMode ? "border-gray-300 bg-white" : "border-gray-700 bg-gray-900"
  }`;

  return (
    <div className={sidebarClass}>
      <h1
        className={`text-2xl font-bold my-8 pl-3 cursor-pointer ${
          isLightMode ? "" : "text-white"
        }`}
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
            className={`flex items-center gap-3 relative cursor-pointer rounded-lg p-3 my-3 transition-transform duration-200 transform hover:scale-105 ${
              isLightMode ? "hover:bg-gray-100" : "hover:bg-gray-800"
            }`}
          >
            <span
              className={
                selectedItem === item.text
                  ? isLightMode
                    ? "text-gray-800"
                    : "text-white"
                  : isLightMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }
            >
              {React.cloneElement(item.icon, {
                className: "w-5 h-5",
              })}
            </span>
            <span
              className={`${selectedItem === item.text ? "font-bold" : ""} ${
                isLightMode ? "" : "text-gray-200"
              }`}
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
          className={`flex items-center gap-3 relative cursor-pointer rounded-lg p-3 my-3 transition-transform duration-200 transform hover:scale-105 ${
            isLightMode ? "hover:bg-gray-100" : "hover:bg-gray-800"
          }`}
        >
          <span className={`${isLightMode ? "text-gray-400" : "text-gray-500"}`}>
            {React.cloneElement(sidebarItems[sidebarItems.length - 1].icon, {
              className: "w-5 h-5",
            })}
          </span>
          <span className={isLightMode ? "" : "text-gray-200"}>
            {sidebarItems[sidebarItems.length - 1].text}
          </span>
        </div>
      </div>

      {showRightSidebar && (
        <div className={`absolute left-[100%] w-[300px] h-screen shadow-lg border z-50 ${
          isLightMode ? "bg-white border-gray-300" : "bg-gray-800 border-gray-700"
        }`}>
          <SearchSideBar setShowRightSidebar={setShowRightSidebar} isDarkMode={!isLightMode} />
        </div>
      )}

      {showMoreItems && (
        <ClickAwayListener onClickAway={() => setShowMoreItems(false)}>
          <div className={`absolute bottom-20 w-[250px] shadow-lg z-50 rounded-2xl ${
            isLightMode ? "bg-gray-100 text-gray-700" : "bg-gray-800 text-gray-200"
          }`}>
            <div className="p-2">
              {moreItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (index === 0) {
                      setTheme(isLightMode ? "dark" : "light");
                    } else if (index === 1) {
                      window.open("https://github.com/pulkit161001/InstaCode/issues/new", "_blank");
                    }
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${
                    isLightMode ? "hover:bg-gray-50" : "hover:bg-gray-700"
                  }`}
                >
                  <span className={isLightMode ? "text-gray-500" : "text-gray-400"}>
                    {React.cloneElement(
                      index === 0
                        ? isLightMode
                          ? item.icon[0]
                          : item.icon[1]
                        : item.icon,
                      { className: "w-5 h-5" }
                    )}
                  </span>
                  <span>
                    {index === 0
                      ? isLightMode
                        ? item.text[0]
                        : item.text[1]
                      : item.text}
                  </span>
                </div>
              ))}
            </div>
            <hr className={`border-t border-2 ${isLightMode ? "border-gray-200" : "border-gray-700"}`} />
            <div className="p-2">
              <a
                href="https://leetcode.com/assessment/"
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  isLightMode ? "hover:bg-gray-50" : "hover:bg-gray-700"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={isLightMode ? "text-gray-500" : "text-gray-400"}>
                  {redirectIcon}
                </span>
                <span>Assessment</span>
              </a>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

const SearchSideBar = ({ setShowRightSidebar, isDarkMode }) => {
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
      <div className={`h-full p-4 ${isDarkMode ? "bg-gray-800" : ""}`}>
        <div className="flex justify-between items-center mb-10">
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : ""}`}>
            Search
          </h2>
        </div>
        <input
          ref={inputRef}
          className={`w-full px-4 py-2 rounded-md mb-6 outline-none ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
          }`}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          autoFocus
        />
        <div className={`flex justify-between mb-4 border-t pt-4 ${
          isDarkMode ? "border-gray-700" : ""
        }`}>
          <h3 className={`text-base font-medium ${isDarkMode ? "text-gray-300" : ""}`}>
            Recent
          </h3>
          <h3
            className={`text-base font-medium cursor-pointer ${
              isDarkMode
                ? "text-cyan-400 hover:text-cyan-300"
                : "text-cyan-400 hover:text-cyan-200"
            }`}
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
              isDarkMode={isDarkMode}
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
  isDarkMode,
}) => {
  const handleItemClick = () => {
    navigate(`/${term.username}`);
    setSearchTerm("");
    inputRef.current?.blur();
    setShowRightSidebar(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const updatedSearches = recentSearches.filter(
      (search) => search.username !== term.username
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  return (
    <div
      onClick={handleItemClick}
      className={`flex justify-between items-center p-3 rounded-md transition-colors duration-200 cursor-pointer ${
        isDarkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100"
      }`}
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
          className={isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}
          onClick={handleDelete}
        >
          ✕
        </button>
        <span className={`text-center absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 text-white text-xs rounded-md ${
          isDarkMode ? "bg-gray-600" : "bg-gray-300"
        }`}>
          Delete
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
