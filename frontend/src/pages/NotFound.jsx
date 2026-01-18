import React from "react";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-800 mb-4">404</p>
        <p className="text-2xl text-gray-600 mb-2">Page Not Found</p>
        <p className="text-lg text-gray-500 mb-6">
          The page you are looking for doesn't exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
