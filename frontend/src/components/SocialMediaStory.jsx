import React from 'react'
import twitter from "../assets/twitter.png"
import linkedin from "../assets/linkedin.png"
import github from "../assets/github.png"

const SocialMediaStory = () => {
    return (
        <div className="w-full flex overflow-hidden rounded">
          <div className="flex flex-col text-left justify-start items-center p-2 cursor-pointer">
            <div className="w-20 h-20 rounded-full border border-gray-500 p-0.5">
              <img
                loading="lazy"
                className="rounded-full h-full w-full "
                src={linkedin} // Path to the new JS icon you uploaded
                draggable="false"
                alt="javascript"
              />
            </div>
            <span className="text-xs font-medium text-white mt-2">GitHub</span>
          </div>
    
    {/* twitter */}
    {/* change bg to white */}
    <div className="flex flex-col text-left justify-start items-center p-2 cursor-pointer">
            <div className="w-20 h-20 rounded-full border border-gray-500 p-0.5">
              <img
                loading="lazy"
                className="rounded-full h-full w-full "
                src={twitter} // Path to the new JS icon you uploaded
                draggable="false"
                alt="javascript"
              />
            </div>
            <span className="text-xs font-medium text-white mt-2">GitHub</span>
          </div>
    
    {/* github */}
          <div className="flex flex-col text-left justify-start items-center p-2 cursor-pointer">
            <div className="w-20 h-20 rounded-full border border-gray-500 p-0.5">
              <img
                loading="lazy"
                className="rounded-full h-full w-full "
                src={github} // Path to the new JS icon you uploaded
                draggable="false"
                alt="javascript"
              />
            </div>
            <span className="text-xs font-medium text-white mt-2">GitHub</span>
          </div>
          
        </div>
      );
}

export default SocialMediaStory