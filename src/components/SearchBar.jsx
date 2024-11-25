
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ searchQuery, handleChange, handleSearch }) => {
  return (
    <div className="flex items-center mt-8 w-full space-x-1 max-w-lg">
      <div className="flex items-center border border-gray-300 rounded-md px-2 w-full">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search asset"
          value={searchQuery}
          onChange={handleChange}
          className="w-full p-2 outline-none bg-transparent"
        />
      </div>
      <button
        onClick={() => handleSearch(searchQuery)}
        className="bg-[#0E8190] text-white px-8 py-2 rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
