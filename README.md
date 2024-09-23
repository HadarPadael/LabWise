# LabWise

## Overview
**LabWise** is a web-based application designed to handle research data, particularly for labs; Working with a pre-defined structure (Project> research questions> experiments> samples> results), the app allows neat and efficient data management. The app integrates with Dropbox for file storage and Firebase for metadata management. LabWise allows users to upload, track, and manage research data through an intuitive and user friendly interface, making data organization and access easier for lab teams.

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Installation Guide](#installation-guide)
5. [App Usage](#app-usage)
6. [Server Usage](#server-usage)
7. [Dropbox Integration](#dropbox-integration)
8. [Firebase Integration](#firebase-integration)
---

## Introduction
LabWise is developed to solve the problem of managing complex hierarchies of research data, typically involving multiple research questions, experiments, samples, and processed results. By integrating Dropbox for file storage and Firebase for metadata management, the app allows researchers to organize their work in an easy-to-use interface.

The app's purpose is to assist lab members in managing their projects, reducing the hassle of manually keeping track of data files, and offering a clear visual representation of research questions, experiments, samples, and results.

## Features
- **Project Hierarchy**: Manage projects with multiple research questions, experiments, samples, and results.
- **Data Uploads**: Upload files related to research and have them linked directly to samples in Dropbox.
- **Description Management**: Update and manage descriptions of various levels (projects, questions, experiments, samples).
- **Dropbox Integration**: Store research files directly in Dropbox, with metadata managed in Firebase.
- **Firebase Integration**: Store all project metadata and hierarchies in Firebase for easy access and updates.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: Firebase (Firestore)
- **File Storage**: Dropbox API
- **Other Tools**: Git, Bootstrap for UI, Fetch API for network calls

---

## Installation Guide

### Prerequisites
- **Node.js** installed (v14 or higher)
- **Firebase account** with Firestore enabled
- **Dropbox account** with an access token
- **Git** for version control
- **npm** for managing dependencies

### Step 1: Clone the Repository
```bash
git clone https://github.com/liba21/Nissans-Project.git
```
### Step 2: Install Dependencies
Navigate to the app and server folders and install dependencies:
```bash
cd App
npm install
cd ../server
npm install
```
this will install the dependencies from package.json.

### Step 4: Setup Firebase

#### Step 4.1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click the "Add Project" button.
3. Enter a project name (for example, `LabWise`), agree to the terms, and click "Continue".
4. You can choose whether or not to enable Google Analytics for your project (it's optional).
5. Click "Create Project". Firebase will take a few moments to set up your new project.

#### Step 4.2: Enable Firestore
1. In your Firebase project console, click on **Firestore Database** from the left-hand sidebar under **Build**.
2. Click "Create Database" and select **Start in production mode**. Click "Next".
3. Choose the region where your data will be stored (preferably near your user base), and click "Enable".
4. Firestore will now be enabled and ready for storing your project data.

#### Step 4.3: Get Firebase Configuration (Client-Side)
1. In the Firebase console, click on the **Settings (gear icon)** next to **Project Overview** on the left sidebar.
2. Select **Project Settings**.
3. Scroll down to the **Your Apps** section.
4. Click on the **</> icon** to add Firebase to your web app (this option is under the Web section).
5. Register your app (you can give it a name like `labwise-client`) and click **Register App**.
6. Firebase will provide you with your configuration keys (scroll down and make sure to choose the "config" option).
   It will look like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "your-api-key",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "your-messaging-sender-id",
      appId: "your-app-id",
      measurementId: "your-measurement-id"
    };
    ```
8. Copy this configuration to "App/src/firebaseConfig.js"

#### Step 4.4: Set Up Firebase Admin SDK (Server-Side)
1. In the Firebase console, go to **Project Settings** by clicking the gear icon in the top-left corner.
2. Click the **Service Accounts** tab at the top.
3. Under the **Firebase Admin SDK** section, click on **Generate New Private Key**.
4. This will download a JSON file containing your `serviceAccountKey`. Keep it safe and store it in your project folder under "Server/config
/serviceAccountKey.json".

#### Step 4.5: Enable Authentication to enable user sign in 
1. In your Firebase console, click on **Authentication** under **Build**.
2. Click the **Get Started** button.
3. Choose **Email/Password**  as your authintication method by clicking on its "Enable" toggle button and saving changes.
4. You can also enable other sign-in methods like Google, Facebook, etc., if decided so later on.

### Step 5: Setup Dropbox:

#### Step 5.1: Create a Dropbox Account
If you don’t already have a Dropbox account, you will need to create one:

1. Go to [Dropbox](https://www.dropbox.com/).
2. Sign up for a free or premium account based on your needs.
3. Log into your Dropbox account.

#### Step 5.2: Create a Dropbox App
To integrate Dropbox into LabWise, you need to create a Dropbox App, which will provide the API keys and tokens required to interact with Dropbox from the server.

1. Navigate to the [Dropbox Developer Console](https://www.dropbox.com/developers/apps).
2. Click **Create App**.
3. Choose the following options:
   - **Scoped Access**: Select this for better security as it allows you to define specific permissions for your app.
   - **Full Dropbox** or **App Folder**: Choose based on whether you want your app to have access to the user’s entire Dropbox account or just an app-specific folder. (For LabWise, you can choose **App Folder** if you want to store all files under a dedicated folder, thats the option I chose).
   - Give your app a name (for example., `LabWise-App`).
4. Click **Create App** to finish setting up the application.

#### Step 5.3: Set App Permissions
After creating your app, you need to set the permissions it will have when interacting with Dropbox.

1. Go to the **Permissions** tab of your app.
2. Enable the following permissions:
   - `files.content.read`: To allow your app to read content from Dropbox.
   - `files.content.write`: To allow your app to write/upload files to Dropbox.
   - `files.metadata.read`: To allow your app to read file and folder metadata.
   - `sharing.write`: To allow your app to View and manage your Dropbox sharing settings and collaborators (needed in order to create sharedlinkes).
3. Save your changes by clicking **Submit**.

#### Step 5.4: Generate Access Token
To allow your app to interact with Dropbox, you need to generate an access token. 
This token will be used by the LabWise server to authenticate requests to Dropbox.

1. Go to the **Settings** tab of your app.
2. Scroll down to the **OAuth 2** section.
3. Under **OAuth 2 settings**, you will see a button labeled **Generate Access Token**.
4. Click **Generate Access Token**.
5. Copy the generated access token to "Server/.env". This token will be used in your server’s environment variables to authenticate Dropbox API requests.
   You'll need to regenerate it every once in a while.

#### Step 5.5: Configure the Access Token in Your Application
Once you have the Dropbox access token, you'll need to store it securely in your environment variables.

1. To the same "Server/.env" from the previous step, add the environment variables below.
   ```bash
     DROPBOX_ACCESS_TOKEN=ACCESS_TOKEN
     DROPBOX_APP_KEY=APP_KEY
     DROPBOX_APP_SECRET=APP_SECRET
  ```
2. Install the Dropbox SDK (if not installed already by "npm install"):
```bash
npm install dropbox
```
### Step 6: Run the app

#### Start the server:
```bash
   cd server
   npm start
```

#### Start the client:
```bash
   cd App
   npm start
```
notice to run them in parallel.

---

## App Usage:

### Dashboard
Once you log in, you’ll be directed to the dashboard, which provides two main options:

- **Browse:** Browse through research projects and their related questions, experiments, and samples. The app allows you to search across projects or results.
  Navigate through research questions, experiments, and samples with ease.

- **Add:** Add new data to the database. To add a project, from the project dashboard, click on "Add New Project."; Fill in the required information and submit.
  To add Processed Data, Upload results and associate them with specific a specific project, research question, experiment and sample.
  Fill out the description and upload the relevant file.

## Server Usage
The backend server provides API routes to manage the app's communication with Dropbox and Firebase. Key routes include:

- **List All Projects:** *GET* /api/dropbox/projects
- **Add New Item:** *POST* /api/dropbox/addNew
- **Update Description:** *POST* /api/dropbox/updateDescription
- **Remove Item:** *POST* /api/dropbox/removeItem
- **Get Shareable Link:** *POST* /api/dropbox/getShareableLink

The server runs on "localhost:5000" and handles all interactions between the frontend, Dropbox, and Firebase.

---

## Dropbox Integration
LabWise integrates with Dropbox to store research files. Each file uploaded through the app is saved under the correct project, question, experiment, and sample. 
The firebase stores them as well, but is limited in the means that removing an item from the app removes it from firebase but not from dropbox. that and more, only the description of an existing file can be edited via the app, and addition adds to both dropbox and firebase.

#### To manage files:
- **Upload Files:** Use the Processed Data feature to upload results files directly, or use the "Add New" button at the buttom of each level in the "Browse" option to add
  to a specific location during search.
- **Get Shareable Links:** The server can generate shareable links for files stored in Dropbox for easy collaboration. this, allows easy viewing of result files - simply 
  click it!

## Firebase Integration
Firebase Firestore is used to store all metadata related to projects, questions, experiments, and samples. Each project is stored as a document in Firestore collection "projects", with easy-to-use methods in the server to query or update its data.

**Firestore Structure:**
- **projects:** A collection where each document represents a project.
- **research_questions:** An array field inside a project that contains its research questions.
- **experiments:** An array field inside each research question., storing experiments.
- **samples:** An array field inside each experiment, storing samples.
- **results:** An array field inside each sample, storing files and their corresponding descriptions.

---
***This app is merely a proof of concept, not a fully functioning app for production. 
It's basic and most fundamental functionalities work well, but still require further developement.***

Good luck!
