import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { axiosInstance } from "../lib/axios";

const LEETCODE_USERNAME = "pulkit161001";

const RightSidebar = () => {
  const { isDarkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/${LEETCODE_USERNAME}`);

        // Extract profile info from response
        const matchedUser = response.data.matchedUser || {};
        const userProfile = matchedUser.profile || {};
        setProfileData({
          username: matchedUser.username || LEETCODE_USERNAME,
          userAvatar: userProfile.userAvatar || "",
          realName: userProfile.realName || "LeetCode User"
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <div className="mt-5">
        <p className={`font-semibold text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Contributions</p>
      </div>

      <div className={`shadow-md p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        {loading && (
          <div className={`text-center py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading profile...
          </div>
        )}

        {error && (
          <div className={`text-center py-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
            Error: {error}
          </div>
        )}

        {profileData && !loading && !error && (
          <div className="flex items-center mb-4">
            <img
              src={profileData.userAvatar}
              alt={`${profileData.realName}'s avatar`}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-grow">
              <div className={`text-sm font-bold ${isDarkMode ? "text-white" : ""}`}>
                {profileData.username}
              </div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {profileData.realName}
              </div>
            </div>
            <a
              href="https://leetcode.com/u/pulkit161001/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
            >
              Follow
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
