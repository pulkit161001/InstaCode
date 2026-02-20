import React from "react";
import { useTheme } from "../hooks/useTheme";

const UsersDialogItem = ({ logo, text }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex space-x-3 items-center">
        {logo}
        <div className="flex flex-col text-sm">
          <span className={`text-sm font-normal ml-3 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{text}</span>
        </div>
      </div>
    </div>
  );
};

export default UsersDialogItem;
