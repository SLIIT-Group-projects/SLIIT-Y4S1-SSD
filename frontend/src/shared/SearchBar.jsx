import React, { useState } from "react";

function SearchBar({ onSearch }) {
  // Accept onSearch as a prop
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery); // Pass the search query to the parent component
  };

  return (
    <div className="flex justify-center py-4">
      <div className="w-full max-w-md">
        <form className="flex items-center border border-gray-300 rounded-lg" onSubmit={handleSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-l-lg"
            type="search"
            placeholder="Search for a patient"
            aria-label="Search"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
