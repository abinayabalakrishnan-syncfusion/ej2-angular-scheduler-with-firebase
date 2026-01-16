# Angular Firebase Scheduler

This project is an Angular application that integrates the Syncfusion Scheduler component with Firebase Firestore to enable real-time data storage and live scheduling updates.

## Table of Content
1. [Prerequisites](#prerequisites)

2. [Application Setup](#application-setup)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
   - [Firebase Configuration](#firebase-configuration)
   - [Firestore Setup](#firestore-setup)
3. [Running the Application](#running-the-application)
4. [Output Preview](#output-preview)
5. [Troubleshooting](#troubleshooting)
6. [Quick Start](#quick-start)


## Prerequisites

Ensure the following are installed before starting:

- **Node.js** v14.x or later  
- **npm** v6.x or later (included with Node.js)  
- **Angular CLI** v15.x or later  

### Verify versions
```bash
node -v
npm -v
ng version
``` 

## Application Setup


### Clone the Repository
```bash
git clone https://github.com/SyncfusionExamples/ej2-angular-scheduler-with-firebase.git

cd ej2-angular-scheduler-with-firebase
```
### Install Dependencies
```bash
npm install
```


### Firebase Configuration

1. Go to the Firebase Console: [Link](https://console.firebase.google.com/)

2. Create a new Firebase project.

3. In the project dashboard, click **Add app → Web (</>)** and register the app.

4. Copy the Firebase configuration provided.

5. Open `src/main.ts` and replace the existing `firebaseConfig` with your details:

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```
6. Save the file.

### Firestore Setup

1. Open the Firebase Console and select your project.
2. Navigate to **Firestore Database** and click **Create database**.
3. Choose **Start in test mode** (for development) and complete the setup.
4. Create the following collections:
   - `Data` — Stores scheduler event data
   - `ResourceData` — Stores scheduler resource details




## Running the Application

Run the following command to start the app:
```bash
ng serve
```

Open your browser at: `http://localhost:4200`

## Output Preview

![Preview](image.png)


## Troubleshooting

- **Application does not start**
  - Ensure Node.js and Angular CLI are installed
  - Check versions using:
    ```bash
    node -v
    ng version
    ```

- **`ng serve` command not found**
  - Install Angular CLI globally:
    ```bash
    npm install -g @angular/cli
    ```

- **Firebase data not loading**
  - Verify Firebase configuration in `src/main.ts`
  - Ensure Firestore is enabled in the Firebase Console
  - Confirm `Data` and `ResourceData` collections exist

- **Firestore permission denied errors**
  - Make sure Firestore is set to **test mode** during development
  - Check Firestore security rules

- **Port 4200 already in use**
  - Run the application on a different port:
    ```bash
    ng serve --port 4300
    ```

- **Dependency installation issues**
  - Delete `node_modules` and reinstall dependencies:
    ```bash
    npm install
    ```


## Quick Start

```bash
git clone https://github.com/SyncfusionExamples/ej2-angular-scheduler-with-firebase.git

cd ej2-angular-scheduler-with-firebase

npm install

ng serve
```