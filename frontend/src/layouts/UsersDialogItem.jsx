import React from "react";

const UsersDialogItem = ({ logo, text }) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex space-x-3 items-center">
        {logo}
        <div className="flex flex-col text-sm">
          <span className="text-black text-sm font-normal ml-3">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default UsersDialogItem;
