import React, { useState } from "react";
import { FaEye, FaDownload, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Modal from "./Modal";

function ListItem({ name, items, onClick, level, onRemove }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Modal state
  const [modalContent, setModalContent] = useState(""); // Content for the modal

  // Function to handle showing the description in the modal
  const handleViewDescription = (description) => {
    setModalContent(description);
    setShowModal(true); // Open modal
  };

  const handleDownload = async () => {
    if (level === "Results" || level === "Processed Data") {
      try {
        const response = await fetch(items.file_path);
        if (response.ok) {
          const blob = await response.blob();
          saveAs(blob, items.file_path.split("/").pop());
        } else {
          console.error("Failed to download file.");
        }
      } catch (error) {
        console.error("Download error:", error);
      }
    } else {
      const zip = new JSZip();
      await addItemsToZip(zip, items, level);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${name}.zip`);
    }
  };

  const addItemsToZip = async (zip, item, level) => {
    let folder;

    if (level === "Projects") {
      folder = zip.folder(item.name);
      for (const question of item.research_questions) {
        await addItemsToZip(folder, question, "Research Questions");
      }
    } else if (level === "Research Questions") {
      folder = zip.folder(item.name);
      for (const experiment of item.experiments) {
        await addItemsToZip(folder, experiment, "Experiments");
      }
    } else if (level === "Experiments") {
      folder = zip.folder(item.name);
      for (const sample of item.samples) {
        await addItemsToZip(folder, sample, "Samples");
      }
    } else if (level === "Samples") {
      folder = zip.folder(item.name);
      for (const result of item.results) {
        try {
          const response = await fetch(result.file_path);
          if (response.ok) {
            const blob = await response.blob();
            folder.file(result.file_path.split("/").pop(), blob);
          } else {
            console.error(`Failed to fetch ${result.file_path}`);
          }
        } catch (error) {
          console.error(`Error fetching ${result.file_path}:`, error);
        }
      }
    }
  };

  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        // Make a server call to remove the item from Firebase
        const response = await fetch(
          "http://localhost:5000/api/dropbox/removeItem",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              level: level.toLowerCase(),
              path: items.path, // Pass parentPath for correct hierarchy
              itemName: items.name, // Pass the name of the item to remove
            }),
          }
        );

        if (response.ok) {
          console.log(`${level} removed successfully from Firebase.`);
          onRemove(items); // Optionally update the UI after deletion
        } else {
          alert("Failed to remove item from Firebase.");
        }
      } catch (error) {
        console.error("Error removing item from Firebase:", error);
      }
    }
  };

  const handleEdit = () => {
    navigate("/edit-form", {
      state: { level: level.toLowerCase(), data: { ...items } },
    });
  };

  const getDescription = (level, item) => {
    if (item?.description) {
      return `${item.description}`;
    } else {
      return "No Description Available";
    }
  };

  return (
    <>
      <li
        className="list-group-item d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
      >
        <span
          style={{ color: "blue", textDecoration: "underline" }}
          onClick={onClick}
        >
          {name}
        </span>
        <div>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleViewDescription(getDescription(level, items))}
          >
            <FaEye /> View Description
          </button>

          {/* Conditionally render the Edit button */}
          {level !== "Results" && (
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={handleEdit}
            >
              <FaEdit /> Edit
            </button>
          )}

          <button className="btn btn-sm btn-danger me-2" onClick={handleRemove}>
            <FaTrash /> Remove
          </button>
          <button className="btn btn-sm btn-success" onClick={handleDownload}>
            <FaDownload /> Download
          </button>
        </div>
      </li>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} content={modalContent} />
      )}
    </>
  );
}

export default ListItem;
