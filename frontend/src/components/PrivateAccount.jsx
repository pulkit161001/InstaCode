import { useState } from "react";
import { LockIcon } from "../utils/SvgIcons";
import UsersDialog from "../layouts/UsersDialog";
import { badgeIcon, streakIcon, globeIcon } from "../utils/SvgIcons";
import { useTheme } from "../hooks/useTheme";

const PrivateAccount = () => {
  const { isDarkMode } = useTheme();
  const [reasonDialog, setReasonDialog] = useState(false);
  const reasonDialogItems = [
    {
      logo: badgeIcon,
      text: "This account has no badge to showcase.",
    },
    {
      logo: streakIcon,
      text: "This user has solved less than 10 problems.",
    },
    {
      logo: globeIcon,
      text: "No social media account attached.",
    },
  ];

  return (
    <div className={`flex flex-col items-center justify-center h-full py-8 border-t ${
      isDarkMode ? "border-gray-700" : ""
    }`}>
      <div className="flex items-center text-center">
        <span className="mr-4">{LockIcon}</span>
        <div className="text-left">
          <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>This account is private</p>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Visit LeetCode to see their data
          </p>
        </div>
      </div>
      <button
        className={`mt-4 px-4 py-2 font-medium rounded-md text-white ${
          isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => setReasonDialog(true)}
      >
        See Why
      </button>

      <UsersDialog open={reasonDialog} onClose={() => setReasonDialog(false)} heading={"How we made this decision"} items={reasonDialogItems}/>
    </div>
  );
};

export default PrivateAccount;
