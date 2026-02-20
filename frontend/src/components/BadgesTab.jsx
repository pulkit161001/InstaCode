import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "@mui/material";
import {
  metaballsMenu,
  pinIcon,
} from "../utils/SvgIcons";
import { Heart, MessageCircle, Send } from "lucide-react";
import positiveComments from "../constants/comments";
import default_avatar from "../assets/default_avatar.jpg";
import AboutThisAccount from "../layouts/AboutThisAccount";
import { useTheme } from "../hooks/useTheme";

const badgeOrder = ["Guardian", "Knight", "Annual Badge"];

const sortBadges = (a, b) => {
  const indexA = badgeOrder.findIndex((keyword) =>
    a.displayName.includes(keyword)
  );
  const indexB = badgeOrder.findIndex((keyword) =>
    b.displayName.includes(keyword)
  );

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;

  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);

  if (dateA > dateB) return -1; // a comes first if it's more recent
  if (dateA < dateB) return 1;

  return a.id - b.id;
};

const calculateTimeAgo = (creationDate) => {
  const createdDate = new Date(creationDate);
  const currentDate = new Date();

  // Calculate the difference in days
  const differenceInMs = currentDate - createdDate;
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) {
    return "today";
  } else if (differenceInDays < 7) {
    return `${differenceInDays}d`;
  } else {
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    return `${differenceInWeeks}w`;
  }
};

// TO-DO - pagination (with loading) and in the HomePage also
const BadgesTab = ({ userData }) => {
  const sortedBadges = userData.matchedUser.badges.sort(sortBadges);
  return (
    <div className="w-full mx-auto ">
      <div className="grid grid-cols-3 gap-1 my-1 mb-8">
        {sortedBadges.map((badge, i) => (
          <BadgeItem
            badge={badge}
            key={i}
            views={userData.matchedUser.profile.postViewCount}
            username={userData.matchedUser.username}
            dp={userData.matchedUser.profile.userAvatar}
            country={userData.matchedUser.profile.countryName}
            pin={
              badge.displayName.includes("Guardian") ||
              badge.displayName.includes("Knight") ||
              badge.displayName.includes("Annual Badge")
            } // Pass pin prop
            skillTags={userData.matchedUser.profile.skillTags}
            userData={userData}
          />
        ))}
      </div>
    </div>
  );
};

BadgesTab.propTypes = {
  userData: PropTypes.shape({
    matchedUser: PropTypes.shape({
      badges: PropTypes.arrayOf(PropTypes.object),
      profile: PropTypes.object,
      username: PropTypes.string,
    }),
  }).isRequired,
};

// if country not exist
// add tags also (java, c++)
// TO-DO - add comment logo and length should be there
function BadgeItem({
  badge,
  views,
  username,
  dp,
  country,
  pin,
  skillTags,
  userData,
}) {
  const { isDarkMode } = useTheme();
  const iconUrl = badge.icon.startsWith("http")
    ? badge.icon
    : `https://leetcode.com${badge.icon}`;

  const gifUrl = badge.medal.config.iconGif;
  const gifBackground = badge.medal.config.iconGifBackground;

  const originalDate = new Date(badge.creationDate);

  const fullDateFormat = originalDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  views = (views - 1).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const badgeNameTag = `#${badge.name.replace(/\s+/g, "").toLowerCase()}`;

  const [openImage, setOpenImage] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [showAboutProfile, setShowAboutProfile] = useState(false);
  //comment,random_list,random_upvotes
  const [comments, setComments] = useState([]);

  const openDialog = () => {
    const comments = getRandomComments(username);
    setComments(comments);
    setOpenImage(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gifUrl);
      alert("Link Copied");
    } catch {
      alert("Failed to copy!");
    }
  };

  return (
    <>
      <div
        onClick={openDialog}
        className={`group aspect-square flex justify-center items-center cursor-pointer relative ${
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
        }`}
      >
        <img
          draggable="false"
          loading="lazy"
          className="object-contain h-full w-full"
          src={iconUrl}
          alt={badge.displayName}
        />
        <div className="hidden font-bold group-hover:flex text-white absolute pointer-events-none gap-4">
          <span>{badge.displayName}</span>
        </div>

        {/* Pin icon in the top right corner */}
        {pin && (
          <div className="absolute top-2 right-2">
            {" "}
            {/* Position pin icon */}
            {pinIcon}
          </div>
        )}
      </div>

      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        maxWidth="xl"
        PaperProps={{
          style: {
            backgroundColor: isDarkMode ? "#1f2937" : "white",
          },
        }}
      >
        <div className="flex sm:flex-row flex-col max-w-7xl">
          <div
            className="relative flex items-center justify-center sm:h-[90vh] w-full "
            style={{
              backgroundImage: `url(${gifBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "90vh", // Ensure it has a height for the background to show
            }}
          >
            <img
              draggable="false"
              className="object-contain h-full w-full "
              src={gifUrl}
              alt={badge.displayName}
            />
          </div>

          <div className={`flex flex-col justify-between border w-full max-w-xl rounded ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}>
            {/* id with menu icon */}
            <div className={`flex justify-between px-3 py-2 border-b items-center ${
              isDarkMode ? "border-gray-700" : ""
            }`}>
              {/* icon with name */}
              <div className="flex space-x-3 items-center">
                <div>
                  <img
                    draggable="false"
                    className="w-10 h-10 rounded-full object-cover"
                    src={dp}
                    alt={username}
                  />
                </div>
                <div className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>{username}</div>
                <span className="mx-1">{" • "}</span>{" "}
                {/* Space added around bullet */}
                <div className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>{country}</div>
              </div>
              <span
                className={`cursor-pointer ${isDarkMode ? "text-white" : "text-black"}`}
                onClick={() => setMoreOptions(true)}
              >
                {metaballsMenu}
              </span>
            </div>

            <Dialog
              open={moreOptions}
              onClose={() => setMoreOptions(false)}
              onClick={() => setMoreOptions(false)}
              maxWidth="xl"
              PaperProps={{
                style: {
                  backgroundColor: isDarkMode ? "#1f2937" : "white",
                },
              }}
            >
              <div className="flex flex-col items-center w-80">
                <button
                  onClick={() => handleCopy()}
                  className={`font-normal border-b py-2.5 w-full ${isDarkMode ? 'text-white hover:bg-gray-700 border-gray-700' : 'text-black hover:bg-gray-100 border-gray-300'}`}
                >
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    setShowAboutProfile(true);
                  }}
                  className={`font-normal border-b py-2.5 w-full ${isDarkMode ? 'text-white hover:bg-gray-700 border-gray-700' : 'text-black hover:bg-gray-100 border-gray-300'}`}
                >
                  About this account
                </button>
                <button className={`font-normal py-2.5 w-full ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'}`}>
                  Cancel
                </button>
              </div>
            </Dialog>

            <AboutThisAccount
              open={showAboutProfile}
              onClose={() => setShowAboutProfile(false)}
              userData={userData}
            />

            {/* comments */}
            <div className="p-4 w-full flex-1 max-h-[63vh] overscroll-x-hidden overflow-y-auto">
              {/* User comment */}
              <div className="flex items-start">
                <div className="w-12">
                  <img
                    draggable="false"
                    className="w-9 h-9 rounded-full object-cover"
                    src={dp}
                    alt={username}
                  />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <div className="flex items-center">
                    <div className={`text-sm font-semibold mr-2 ${isDarkMode ? "text-white" : "text-black"}`}>{username}</div>
                    <span className={`text-sm mr-1 ${isDarkMode ? "text-white" : "text-black"}`}>
                      {badge.displayName} {"🚀"}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {" @LeetCode"}
                    </span>
                  </div>
                  <div>
                    <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {badgeNameTag}
                    </span>
                    {skillTags.map((skills, idx) => (
                      <span key={idx} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                        {` #${skills}`}
                      </span>
                    ))}
                  </div>
                  <span className={`font-light text-sm mt ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {calculateTimeAgo(badge.creationDate)}
                  </span>
                </div>
              </div>
              {/* iterate through comments */}
              <div className="flex flex-col mt-3">
                {comments.map((comment, idx) => (
                  <div
                    className="flex items-start space-x-1 my-3 cursor-default"
                    key={idx}
                  >
                    <div className="w-12">
                      <img
                        draggable="false"
                        className="w-9 h-9 rounded-full object-cover"
                        src={comment.userAvatar}
                      />
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <div className="flex items-center">
                        <div className={`text-sm font-semibold mr-2 ${isDarkMode ? "text-white" : "text-black"}`}>
                          {comment.username}
                        </div>
                        <span className={`text-sm mr-1 ${isDarkMode ? "text-white" : "text-black"}`}>{comment.comment}</span>
                      </div>
                      <div></div>
                      <span className="font-light text-sm text-gray-300 mt">
                        {comment.random_time}
                        <span className="mx-2" />
                        {comment.random_upvotes} upvotes
                      </span>
                    </div>
                    <div className="w-8 flex items-center justify-between">
                      <Heart className="h-4 w-4" color={isDarkMode ? "white" : "black"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="">
              {/* like comment container */}
              <div className={`flex flex-col px-3 space-y-1 pb-2 ${isDarkMode ? 'border-b border-t border-gray-700' : 'border-b border-t border-gray-300'}`}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex space-x-4">
                    <Heart color={isDarkMode ? "white" : "black"} />
                    <MessageCircle color={isDarkMode ? "white" : "black"} />
                    {/* <button>{metaballsMenu}</button> */}
                    <a
                      href={`https://leetcode.com/u/${username}`}
                      target="_blank"
                      rel="noopener noreferrer" // Security best practice when using target="_blank"
                    >
                      <Send color={isDarkMode ? "white" : "black"} />
                    </a>
                  </div>
                  {/* <button>{metaballsMenu}</button> */}
                </div>

                {/* likes  */}
                <span className={`w-full text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                  Viewed by <span className="font-semibold">{username}</span>{" "}
                  and <span className="font-semibold">{views}</span> others
                </span>

                {/* time */}
                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{fullDateFormat}</span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

const generateRandomTime = () => {
  const units = ["w", "d"];
  const randomUnit = units[Math.floor(Math.random() * units.length)];
  let randomValue;

  if (randomUnit === "w") {
    randomValue = Math.floor(Math.random() * 20) + 1; // Weeks: 1-20
  } else {
    randomValue = Math.floor(Math.random() * 6) + 1; // Days: 1-6
  }

  return `${randomValue}${randomUnit}`;
};

const getRandomComments = (username ) => {
  const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  // If storedSearches is empty, add all comments as anonymous
  if (storedSearches.length === 0) {
    return positiveComments.map(comment => ({
      username: "Anonymous User",
      userAvatar: default_avatar,
      comment,
      random_time: generateRandomTime(),
      random_upvotes: Math.floor(Math.random() * 101), // Random upvotes between 0 and 100
    }));
  }

  // Filter out any stored searches that match the provided username
  const filteredSearches = storedSearches.filter(search => search.username !== username);

  // Limit the number of comments to the length of the filteredSearches array
  const count = Math.min(filteredSearches.length, positiveComments.length);

  // Shuffle the positiveComments array and slice it to the desired count
  const shuffled = positiveComments
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

  // Map over the shuffled comments and assign appropriate usernames and avatars
  return shuffled.map((comment, index) => {
    const storedSearch = filteredSearches[index] || {};  // Default to empty object if out of bounds
    return {
      username: storedSearch.username || "Anonymous User",
      userAvatar: storedSearch.userAvatar || default_avatar,
      comment,
      random_time: generateRandomTime(),
      random_upvotes: Math.floor(Math.random() * 101), // Random upvotes between 0 and 100
    };
  });
};

BadgeItem.propTypes = {
  badge: PropTypes.object.isRequired,
  views: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  dp: PropTypes.string.isRequired,
  country: PropTypes.string,
  pin: PropTypes.bool.isRequired,
  skillTags: PropTypes.array,
  userData: PropTypes.object.isRequired,
};

export default BadgesTab;
