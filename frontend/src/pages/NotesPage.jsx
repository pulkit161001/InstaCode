import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react'; // Importing icons from lucide-react

const NotesPage = () => {
  const [showDescription, setShowDescription] = useState(false);
  //TO-DO : https://leetcode.com/notes/ with the every edit feature that leetcode provide with it's notes

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">My Notes</h1>
        <div className="mt-2 text-gray-600 text-sm">
          <p>Here you can review all your notes.</p>
          <p>You can have all your notes printed as PDF.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Note Item 1 */}
        <div className="group relative bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">1. Two Sum</span>
            
            {/* Hover effect for edit and delete icons */}
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2 absolute top-0 right-0 mt-2">
              <Edit className="w-5 h-5 text-gray-600 cursor-pointer" />
              <Trash2 className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity duration-200 absolute top-0 right-0 mt-2">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {showDescription ? 'Hide Description' : 'Show Description'}
              </button>
            </div>
          </div>

          {/* Description */}
          {showDescription && (
            <p className="mt-2 text-gray-600">This is the Two Sum problem.</p>
          )}
        </div>

        {/* Note Item 2 */}
        <div className="group relative bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">1489. Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree</span>
            
            {/* Hover effect for edit and delete icons */}
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2 absolute top-0 right-0 mt-2">
              <Edit className="w-5 h-5 text-gray-600 cursor-pointer" />
              <Trash2 className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity duration-200 absolute top-0 right-0 mt-2">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {showDescription ? 'Hide Description' : 'Show Description'}
              </button>
            </div>
          </div>

          {/* Description */}
          {showDescription && (
            <p className="mt-2 text-gray-600">This is the description for the problem.</p>
          )}
        </div>
      </div>

      {/* Add Note Button */}
      <button className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
        Add Note
      </button>
    </div>
  );
};

export default NotesPage;
