#!/bin/bash

# Path to the JSON file
JSON_FILE="./Data/projects.json"

# Paths to the default files
DEFAULT_CSV="default_readout.csv"
DEFAULT_PNG="default_chart.png"

# Ensure the main files directory exists
mkdir -p files

# Parse the JSON file and iterate over each result
jq -r '
  .[] |
  .research_questions[] |
  .experiments[] |
  .samples[] |
  .results[] |
  .file_link' "$JSON_FILE" | while read -r filepath; do
  
  # Remove leading slash from the file path
  filepath="${filepath#/}"

  # Determine the file type based on extension
  extension="${filepath##*.}"
  
  # Create directories if they don't exist
  mkdir -p "$(dirname "$filepath")"

  # Copy the appropriate default file to the target location
  if [ "$extension" = "csv" ]; then
    cp "$DEFAULT_CSV" "$filepath"
  elif [ "$extension" = "png" ]; then
    cp "$DEFAULT_PNG" "$filepath"
  fi
  
  echo "Created: $filepath"
done
