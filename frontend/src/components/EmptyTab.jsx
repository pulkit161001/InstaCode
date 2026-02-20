import PropTypes from "prop-types";
import { useTheme } from "../hooks/useTheme";

const EmptyTab = ({ text }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <img src="https://leetcode.com/_next/static/images/null_light-53585615fd723ba992bd2df7a10d10d1.png" alt="No lists icon" className="mx-auto mb-4 w-40 h-40 opacity-75" />
        <p className="text-lg">No {text}</p>
      </div>
    </div>
  );
};

EmptyTab.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EmptyTab;
