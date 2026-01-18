import { ClickAwayListener } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { searchIcon } from "../utils/SvgIcons";


const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null); // Create a reference for the input

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm) {
      navigate(`/${searchTerm}`); // Navigate to new profile with search term as username
      setSearchTerm("");
      inputRef.current?.blur(); // Unfocus the input`
    }
  };

  // TO-DO - search item cross button not working properly
  return (
    <ClickAwayListener onClickAway={() => setSearchTerm("")}>
      <div className="hidden sm:flex items-center gap-3 pl-4 ml-36 w-64 py-2 bg-[#efefef] rounded-lg relative">
        {searchIcon}
        <input
          ref={inputRef} // Assign the ref to the input element
          className="bg-transparent text-sm border-none outline-none flex-1 pr-3"
          type="search" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger navigation and blur on Enter
          placeholder="Search"
        />
      </div>
    </ClickAwayListener>
  );
};

export default SearchBox;
