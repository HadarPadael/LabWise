const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  file_name: String,
  file_path: String,
});

const SampleSchema = new mongoose.Schema({
  name: String,
  description: String,
  results: [ResultSchema],
});

const ExperimentSchema = new mongoose.Schema({
  name: String,
  description: String,
  samples: [SampleSchema],
});

const ResearchQuestionSchema = new mongoose.Schema({
  name: String,
  description: String,
  experiments: [ExperimentSchema],
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  research_questions: [ResearchQuestionSchema],
});

module.exports = mongoose.model("Project", ProjectSchema);
