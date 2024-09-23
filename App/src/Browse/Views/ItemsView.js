import React, { useState } from "react";
import ListItem from "../ListItem/ListItem";
import Search from "../../Navbar/Search";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ItemsView({
  items = [], // Default to empty array if not provided
  searchKeys,
  titleKey,
  onItemClick,
  title,
  showAddButton = true,
  parentPath,
}) {
  const [filteredItems, setFilteredItems] = useState(items);
  const navigate = useNavigate();

  const matchesSearchTerm = (term, item) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return searchKeys.some((key) => {
      if (Array.isArray(item[key])) {
        return item[key].some((subItem) => matchesSearchTerm(term, subItem));
      }
      return item[key]?.toString().toLowerCase().includes(lowerTerm);
    });
  };

  const doSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        matchesSearchTerm(searchTerm, item)
      );
      setFilteredItems(filtered);
    }
  };

  const handleAddNew = () => {
    // Depending on the title (current level), navigate to the correct form
    navigate("/add-form", {
      state: { level: title.toLowerCase(), parentPath }, // Pass the level and parentPath to the form
    });
  };

  const handleRemove = (itemToRemove) => {
    setFilteredItems((prevItems) =>
      prevItems.filter((item) => item !== itemToRemove)
    );
  };

  const itemList = filteredItems.map((item, key) => (
    <ListItem
      name={item[titleKey]}
      items={item}
      key={key}
      level={title}
      description={item.description} // Ensure description is passed correctly
      onClick={() => onItemClick(item)}
      onRemove={handleRemove}
    />
  ));

  return (
    <div className="container">
      <h1 style={{ color: "blue" }}>{title}</h1>
      <Search doSearch={doSearch} />
      {filteredItems.length > 0 ? (
        <ul className="list-group" style={{ width: "100%" }}>
          {itemList}
        </ul>
      ) : (
        <p>No {title.toLowerCase()} found</p> // Show message if no items exist
      )}
      {showAddButton && (
        <button
          className="btn btn-primary mt-3"
          onClick={handleAddNew}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px auto",
            padding: "10px 20px",
          }}
        >
          <FaPlus style={{ marginRight: "10px" }} /> Add New {title}
        </button>
      )}
    </div>
  );
}

export default ItemsView;
