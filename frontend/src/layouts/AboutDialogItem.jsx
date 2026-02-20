import { useTheme } from "../hooks/useTheme";

const AboutDialogItem = ({ logo, text,title }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex space-x-3 items-center">
        <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
          {logo}
        </span>
        <div className="flex flex-col text-sm">
          <span className={`text-sm font-normal ml-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`} title={title}>{text}</span>
        </div>
      </div>
    </div>
  );
};

export default AboutDialogItem;
