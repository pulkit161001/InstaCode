import React from "react";
import { contributions } from "../constants/contributions";

const RightSidebar = () => {
  return (
    <div>
      <div className="flex justify-between items-center mt-5">
        <p className="font-semibold text-gray-500 text-sm">Contributions</p>
        <span className="text-black text-xs font-semibold cursor-pointer">
          See All
        </span>
      </div>
      <div className="bg-white shadow-md p-4">
        {contributions.map((contribution) => (
          <div key={contribution.username} className="flex items-center mb-4">
            <img
              src={contribution.userAvatar}
              alt={`${contribution.realName}'s avatar`}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-grow">
              <div className="text-sm font-bold">{contribution.username}</div>
              <div className="text-xs text-gray-600">
                {contribution.realName} - {contribution.reputation} Reputation
              </div>
            </div>
            <button className="text-sm text-blue-500 font-semibold">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
