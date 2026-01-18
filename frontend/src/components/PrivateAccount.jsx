import React, { useState } from "react";
import { LockIcon } from "../utils/SvgIcons";
import mycolors from "../constants/colors";
import UsersDialog from "../layouts/UsersDialog";
import { badgeIcon, streakIcon, globeIcon } from "../utils/SvgIcons";

const PrivateAccount = () => {
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
    <div className="flex flex-col items-center justify-center h-full py-8 border-t">
      <div className="flex items-center text-center">
        <span className="mr-4">{LockIcon}</span>
        <div className="text-left">
          <p className="text-gray-800 font-semibold">This account is private</p>
          <p className="text-gray-600">
            Visit LeetCode to see their data
          </p>
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 font-medium bg-gray-100 hover:bg-gray-200 rounded-md"
        style={{ backgroundColor: mycolors.blue_button }}
        onClick={() => setReasonDialog(true)}
      >
        See Why
      </button>

      <UsersDialog open={reasonDialog} onClose={() => setReasonDialog(false)} heading={"How we made this decision"} items={reasonDialogItems}/>
    </div>
  );
};

export default PrivateAccount;
