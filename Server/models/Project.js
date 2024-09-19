const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  file_name: { type: String, required: true },
  file_path: { type: String, required: true },
});

const sampleSchema = new Schema({
  sample_id: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  path: { type: String, required: true }, // Add path field
  results: [resultSchema],
});

const experimentSchema = new Schema({
  experiment_id: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  path: { type: String, required: true }, // Add path field
  samples: [sampleSchema],
});

const researchQuestionSchema = new Schema({
  question: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  path: { type: String, required: true }, // Add path field
  experiments: [experimentSchema],
});

const projectSchema = new Schema({
  project_name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  path: { type: String, required: true }, // Add path field
  research_questions: [researchQuestionSchema],
});

module.exports = mongoose.model("Project", projectSchema);


module.exports = mongoose.model("Project", projectSchema);
