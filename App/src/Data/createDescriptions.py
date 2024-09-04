import json
import os

# Load the JSON data
with open('projects.json', 'r') as file:
    data = json.load(file)

# Define the base directory where description files will be saved
output_dir = 'descriptions'

# Create the base output directory if it doesn't exist
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Helper function to create description.txt files
def create_description_file(folder_path, description_content):
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, 'description.txt')
    with open(file_path, 'w') as f:
        f.write(description_content)

# Iterate through the projects and generate description files
for project in data:
    project_folder = os.path.join(output_dir, project["project_name"])
    project_description = f"""
    Project Name: {project['project_name']}
    Free Description: {project['free_description']}
    Official Name: {project['official_name']}
    Creator Name: {project['creator_name']}
    Creation Date: {project['creation_date']}
    """
    create_description_file(project_folder, project_description)

    # Iterate through research questions
    for question in project["research_questions"]:
        question_folder = os.path.join(project_folder, question["question"])
        question_description = f"""
        Research Question: {question['question']}
        Free Description: {question['free_description']}
        Official Name: {question['official_name']}
        Creator Name: {question['creator_name']}
        Creation Date: {question['creation_date']}
        """
        create_description_file(question_folder, question_description)

        # Iterate through experiments
        for experiment in question["experiments"]:
            experiment_folder = os.path.join(question_folder, f"Experiment_{experiment['experiment_id']}")
            experiment_description = f"""
            Experiment ID: {experiment['experiment_id']}
            Free Description: {experiment['free_description']}
            Official Name: {experiment['official_name']}
            Creator Name: {experiment['creator_name']}
            Creation Date: {experiment['creation_date']}
            Model Animal: {experiment['model_animal']}
            Animal Species: {experiment['animal_species']}
            """
            create_description_file(experiment_folder, experiment_description)

            # Iterate through samples
            for sample in experiment["samples"]:
                sample_folder = os.path.join(experiment_folder, f"Sample_{sample['sample_id']}")
                sample_description = f"""
                Sample ID: {sample['sample_id']}
                Description: {sample['description']}
                """
                create_description_file(sample_folder, sample_description)

print(f"Descriptions created in the '{output_dir}' directory.")
