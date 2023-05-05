import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `http://localhost:5000/search?inputText=${searchQuery}`
    );
    const data = await response.json();
    setSearchResult(data.result);
  };

  return (
    <div className="App">
      <h1>Search App</h1>
      <form onSubmit={handleSearchClick}>
        <label>
          Search:
          <input type="text" value={searchQuery} onChange={handleInputChange} />
        </label>
        <button type="submit">Search</button>
      </form>
      <div>{searchResult}</div>
    </div>
  );
}

export default App;
