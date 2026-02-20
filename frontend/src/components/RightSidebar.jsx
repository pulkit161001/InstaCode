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

      <div>
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
          <div className="flex items-center gap-3 py-2.5">
            <a
              href="https://leetcode.com/u/pulkit161001/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5"
            >
              <img
                src={profileData.userAvatar}
                alt={`${profileData.realName}'s avatar`}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="min-w-0">
                <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                  {profileData.username}
                </div>
                <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {profileData.realName}
                </div>
              </div>
            </a>
            <a
              href="https://leetcode.com/u/pulkit161001/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold flex-shrink-0 whitespace-nowrap ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
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
