# Angular Firebase Scheduler

This project is an Angular application that integrates the Syncfusion Scheduler component with Firebase Firestore to enable real-time data storage and live scheduling updates.

## Table of Content

[Prerequisites](#prerequisites)


### Running with the Sample Repository

1. [Application Setup](#application-setup)
2. [Running the Application](#running-the-application)
3. [Output Preview](#output-preview)
### Building the Sample from Scratch
1. [Application Creation](#application-creation)
2. [Install Dependencies](#install-dependencies-1)
3. [Project Structure](#project-structure)
4. [Module Imports & Configuration](#module-imports--configuration)
5. [Firebase Creation & Integration](#firebase-creation--integration)
6. [Firestore Creation & Integration](#firestore-creation--integration)
7. [Development Notes](#development-notes)
8. [Running the Application](#running-the-application-1)
9. [Output Preview](#output-preview-1)

- [Troubleshooting](#troubleshooting)
- [Quick Start](#quick-start)

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
--- 

# Running with the Sample Repository

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
## Running the Application

Run the following command to start the app:
```bash
ng serve
```

Open your browser at: `http://localhost:4200`

## Output Preview

![Preview](image.png)
---
<br/><br/>

---
# Building the Sample from Scratch

## Application Creation 

- ### creation
  Use the Angular CLI command below to create a new Angular application:
  ```bash
  ng new schedule
  ```

- ### Configuration
  During the project creation, select the following options when prompted:
  - Which stylesheet system would you like to use? → CSS
  - Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? → Yes
  - Which AI tools do you want to configure with Angular best practices? → None

  After confirming these options, Angular CLI scaffolds the application and generates the required project files.

- ### Navigate to the Project
  Move into the newly created project directory:
  ```bash
  cd schedule
  ```
- ### Verify Application Setup
  Run the following command to ensure the application was created correctly:
  ```bash  
  ng serve
  ```
  Open your browser and navigate to: `http://localhost:4200`

## Install Dependencies
Install the required packages for the Scheduler component and Firebase integration.
- ### Syncfusion Scheduler
  Install the Syncfusion Angular Scheduler package:
  ```bash
  npm install --save @syncfusion/ej2-angular-schedule
  ```
- ### Angular Firebase (AngularFire)
  Install AngularFire along with the Firebase SDK:
  ```bash
  npm i @angular/fire firebase --legacy-peer-deps
  ```
## Project Structure
```
├── .angular/      
├── .github/                 
├── e2e/                  
├── node_modules/     
├── public/               
├── src/
│   ├── app/
│   │   ├── app.component.css       # Component styles
│   │   ├── app.component.html      # Scheduler template
│   │   ├── app.component.spec.ts   # Unit tests for AppComponent
│   │   ├── app.component.ts        # Scheduler & Firestore logic
│   │   ├── app.config.ts           # Application configuration
│   │   └── app.routes.ts           # Application routes
│   ├── index.html                  # Main HTML entry point
│   ├── main.ts                     # Application bootstrap & Firebase init
│   └── styles.css                  # Global styles
├── .editorconfig   
├── .gitignore      
├── angular.json           
├── browserslist 
├── karma.conf.js
├── package.json
├── package-lock.json 
├── README.md 
├── tsconfig.app.json
├── tsconfig.json 
├── tsconfig.spec.json
└── tslint.json
```

## Module Imports & Configuration

- ### Scheduler Template
  The Scheduler UI with resource grouping and CRUD event handling is defined in:

  **src/app/app.component.html**
  ```
  <ejs-schedule width='100%' height='550px' [selectedDate]="selectedDate" [group]="group" [currentView]="currentView"
      (actionBegin)="onActionBegin($event)">
      <e-resources>
          <e-resource field='ConferenceId' title="Workers" name='Owners' [dataSource]='categoryDataSource'
              [allowMultiple]='allowMultiple'  textField='Text' idField='Id' colorField='Color'>
          </e-resource>
      </e-resources>
  </ejs-schedule>
  ```
  **actionBegin** is used to capture create, update, and delete events 

  **Resource grouping** is configured using the Owners resource

- ### Scheduler & Firestore Integration
  The Scheduler logic and Firestore integration are implemented in:

  **src/app/app.component.ts**
  ```
  import { Component } from '@angular/core';
  import { DayService, WeekService, WorkWeekService, GroupModel, TimelineViewsService, TimelineMonthService, MonthService, AgendaService, ResizeService, DragAndDropService } from '@syncfusion/ej2-angular-schedule';
  import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
  import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
  import { Observable } from 'rxjs';

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [ScheduleModule,],
    providers: [DayService, WeekService, WorkWeekService, TimelineViewsService, TimelineMonthService, MonthService, AgendaService, ResizeService, DragAndDropService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent {
    items: Observable<any[]>;
    resItems: Observable<any[]>;
    public test!: any[];
    public currentView = "Month";
    public schData = { Subject: null, StartTime: null, EndTime: null, ConferenceId: null, IsAllDay: null, Id: null, DocumentId: null };
    public group: GroupModel = { resources: ['Owners'] };
    public categoryDataSource: any;

    public allowMultiple: Boolean = true;
    public selectedDate = new Date(2026, 0, 16);

    constructor(private firestore: Firestore) {
      const resourceCollection = collection(this.firestore, 'ResourceData');
      this.resItems = collectionData(resourceCollection);
      this.resItems.subscribe(resData => {
        this.categoryDataSource = resData;
      });

      const dataCollection = collection(this.firestore, 'Data');
      this.items = collectionData(dataCollection);
      this.items.subscribe(data => {
        this.test = data;
        let schObj = (document.querySelector('.e-schedule') as any).ej2_instances[0];
        this.test.forEach(item => {
          item.StartTime = new Date(item.StartTime.seconds * 1000);
          item.EndTime = new Date(item.EndTime.seconds * 1000);
        });
        schObj.eventSettings.dataSource = this.test;
      });
    }

    public onActionBegin(args: any): void {
      if (args.requestType == "eventChange") {
        const docRef = doc(this.firestore, 'Data', args.changedRecords[0].DocumentId);
        updateDoc(docRef, {
          Subject: args.changedRecords[0].Subject,
          EndTime: args.changedRecords[0].EndTime,
          StartTime: args.changedRecords[0].StartTime,
          IsAllDay: args.changedRecords[0].IsAllDay,
          ConferenceId: args.changedRecords[0].ConferenceId
        });
      } else if (args.requestType == "eventCreate") {
        let guid = this.GuidFun();
        args.data[0].DocumentId = guid;
        this.schData = { ...args.data[0] };
        setDoc(doc(this.firestore, 'Data', guid), this.schData);
      } else if (args.requestType == "eventRemove") {
        deleteDoc(doc(this.firestore, 'Data', args.deletedRecords[0].DocumentId));
      }
    }

    public GuidFun(): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
  ```
  Key configurations in this file:
  - Imports ScheduleModule as a standalone component
  - Provides Scheduler services for different views and interactions
  - Reads real‑time data from Firestore collections (Data, ResourceData)
  - Converts Firestore timestamps to JavaScript Date objects
  - Handles Scheduler CRUD operations using Firestore APIs
  
  Firestore operations used:
  - collection() and collectionData() for real‑time data fetching
  - setDoc() to create events
  - updateDoc() to modify events
  - deleteDoc() to remove events

Each Scheduler event stores a DocumentId field that maps to the Firestore document ID.
- ### Unit Test Configuration
  
This file contains the basic unit test setup for the root application component.  
It verifies that the application initializes correctly using Angular TestBed

  **src/app/app.component.spec.ts**
  ```
  import { TestBed } from '@angular/core/testing';
  import { AppComponent } from './app.component';

  describe('AppComponent', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AppComponent],
      }).compileComponents();
    });

    it('should create the app', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });

    it(`should have the 'angular-app' title`, () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app.title).toEqual('angular-app');
    });

    it('should render title', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Hello, angular-app');
    });
  });
  ```
- ### Styles Configuration
  Create an empty stylesheet file:**src/app/app.component.css**

  This file is required even if no styles are added initially.

- ### Application Configuration
  Routing and zone change detection are configured in:

  **src/app/app.config.ts**
  ```
  import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
  import { provideRouter } from '@angular/router';

  import { routes } from './app.routes';

  export const appConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
  };
  ```
- ### Application Bootstrap & Firebase Providers
  Firebase services are initialized during application bootstrap in:

  **src/main.ts**
  ```
  import { enableProdMode } from '@angular/core';
  import { bootstrapApplication } from '@angular/platform-browser';
  import { AppComponent } from './app/app.component';
  import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
  import { getFirestore, provideFirestore } from '@angular/fire/firestore';
  import { getAuth, provideAuth } from '@angular/fire/auth';
  import { getStorage, provideStorage } from '@angular/fire/storage';

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };

  enableProdMode();

  bootstrapApplication(AppComponent, {
    providers: [
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
      provideStorage(() => getStorage())
    ]
  }).catch(err => console.error(err));
  ```
  This registers:
  - Firebase App
  - Firestore Database
  - Firebase Authentication
  - Firebase Storage

## Firebase Creation & Integration

### Create Firebase Project
- Navigate to the Firebase Console: [Link](https://console.firebase.google.com/)
- Click Add project and enter a project name.
- Proceed through the setup steps and create the project.
- Once the project is created, click Add app → Web (</>).
- Register the web app and copy the generated Firebase configuration.

### Configure Firebase in Angular
Add the Firebase configuration directly into the Angular bootstrap file.
**src/main.ts**
```

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
This configuration is used to initialize Firebase services when the application starts.

## Firestore Creation & Integration

### Enable Firestore Database
- In the Firebase Console, open Build → Firestore Database.
- Click Create database.
- Select Start in test mode (recommended for development).
- Choose a Firestore region and complete setup.

### Create Required Firestore Collections
Create the following collections in Firestore:

- #### Data
  Stores Scheduler event records.
  
  Suggested fields:
  - Subject (string)
  - StartTime (timestamp)
  - EndTime (timestamp)
  - IsAllDay (boolean)
  - ConferenceId (string or number)
  - DocumentId (string – Firestore document ID)

- #### ResourceData
  Stores Scheduler resource information.
  
  Suggested fields:
  - Id (string or number)
  - Text (string)
  - Color (string)
### Firestore Integration in the Application
- Event and resource data are read in real time using collectionData()
- Firestore Timestamp values are converted to JavaScript Date objects before binding to the Scheduler
- Scheduler CRUD operations are handled through the actionBegin event:
  - Create → setDoc()
  - Update → updateDoc()
  - Delete → deleteDoc()
- Each Scheduler event maintains a DocumentId to map it to the corresponding Firestore document

## Development Notes
- Firestore test mode should only be used during development
- Update Firestore security rules before deploying to production
- Ensure collection names (Data, ResourceData) match exactly in code and database

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