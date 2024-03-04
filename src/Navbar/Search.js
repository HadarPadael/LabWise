import React, { useRef, useState } from 'react';
import './Search.css'

function Search({doSearch}) {
  const searchBox = useRef();
  const search = function(){
    doSearch(searchBox.current.value);
  } 
 
  return (
    <div className="search-input-container">
      <input ref={searchBox} onKeyUp={search} className="form-control me-2 search-input" placeholder="Search" aria-label="Search" />
      <i className="bi bi-search search-icon"></i>
      {/* type="search" adds a x on the row */}
    </div>
  );
}

export default Search;
