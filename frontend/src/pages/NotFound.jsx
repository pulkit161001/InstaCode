import { useTheme } from "../hooks/useTheme";

const NotFound = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="text-center">
        <p className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>404</p>
        <p className={`text-2xl mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Page Not Found</p>
        <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          The page you are looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
