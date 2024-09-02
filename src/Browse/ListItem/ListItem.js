import React from "react";
import { FaEye, FaDownload, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function ListItem({ name, items, onClick, level, onRemove }) {
  const navigate = useNavigate();

  const handleDownload = async () => {
    if (level === "Results" || "Processed Data") {
      try {
        const response = await fetch(items.file_link);
        if (response.ok) {
          const blob = await response.blob();
          saveAs(blob, items.file_link.split("/").pop());
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
      folder = zip.folder(item.project_name);
      for (const question of item.research_questions) {
        await addItemsToZip(folder, question, "Research Questions");
      }
    } else if (level === "Research Questions") {
      folder = zip.folder(item.question);
      for (const experiment of item.experiments) {
        await addItemsToZip(folder, experiment, "Experiments");
      }
    } else if (level === "Experiments") {
      folder = zip.folder(`Experiment_${item.experiment_id}`);
      for (const sample of item.samples) {
        await addItemsToZip(folder, sample, "Samples");
      }
    } else if (level === "Samples") {
      folder = zip.folder(`Sample_${item.sample_id}`);
      for (const result of item.results) {
        try {
          const response = await fetch(result.file_link);
          if (response.ok) {
            const blob = await response.blob();
            folder.file(result.file_link.split("/").pop(), blob);
          } else {
            console.error(`Failed to fetch ${result.file_link}`);
          }
        } catch (error) {
          console.error(`Error fetching ${result.file_link}:`, error);
        }
      }
    }
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      onRemove(items);
    }
  };

  const handleEdit = () => {
    navigate("/edit-form", {
      state: { level: level.toLowerCase(), data: items },
    });
  };

  const getDescription = (level, item) => {
    switch (level) {
      case "Projects":
        return `Project Name: ${item.project_name}\nFree Description: ${item.free_description}\nOfficial Name: ${item.official_name}\nCreator Name: ${item.creator_name}\nCreation Date: ${item.creation_date}`;
      case "Research Questions":
        return `Question: ${item.question}\nFree Description: ${item.free_description}\nOfficial Name: ${item.official_name}\nCreator Name: ${item.creator_name}\nCreation Date: ${item.creation_date}`;
      case "Experiments":
        return `Experiment ID: ${item.experiment_id}\nNumber of Samples: ${item.number_of_samples}\nModel Animal: ${item.model_animal}\nAnimal Species: ${item.animal_species}\nFree Description: ${item.free_description}\nOfficial Name: ${item.official_name}\nCreator Name: ${item.creator_name}\nCreation Date: ${item.creation_date}`;
      case "Samples":
        return `Sample ID: ${item.sample_id}\nDescription: ${item.description}`;
      case "Results":
        return `Type: ${item.type}`;
      default:
        return "No Description Available";
    }
  };

  return (
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
          onClick={() => alert(getDescription(level, items))}
        >
          <FaEye /> View Description
        </button>
        <button className="btn btn-sm btn-warning me-2" onClick={handleEdit}>
          <FaEdit /> Edit
        </button>
        <button className="btn btn-sm btn-danger me-2" onClick={handleRemove}>
          <FaTrash /> Remove
        </button>
        <button className="btn btn-sm btn-success" onClick={handleDownload}>
          <FaDownload /> Download
        </button>
      </div>
    </li>
  );
}

export default ListItem;
