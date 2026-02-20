import { Dialog } from "@mui/material";
import UsersDialogItem from "./UsersDialogItem";
import { globeIcon,crossIcon } from "../utils/SvgIcons";
import { useTheme } from "../hooks/useTheme";

const UsersDialog = ({ open, onClose, heading, items = [] }) => {
  const { isDarkMode } = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "12px",
          padding: "0.5rem",
          maxWidth: "fit-content",
          backgroundColor: isDarkMode ? "#1f2937" : "white",
        },
      }}
    >
      <div className="flex flex-col w-full">
        {/* Header Section */}
        <div className={`flex justify-between items-center px-4 border-b py-2 relative ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-300 text-black'}`}>
          <span className="font-medium">{heading}</span>
          <div onClick={onClose} className="absolute right-4 cursor-pointer">{crossIcon}</div>
        </div>
        <div className="overflow-x-hidden w-full p-3">
          {/* Content Section */}
          {items.map((item, idx) => (
            <UsersDialogItem key={idx} logo={item.logo} text={item.text} />
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default UsersDialog;
