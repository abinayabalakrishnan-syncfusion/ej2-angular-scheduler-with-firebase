import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCyuI75-v_ujddkK53gYDsLlwLi4ho14XE",
  authDomain: "schedular-with-firebase.firebaseapp.com",
  projectId: "schedular-with-firebase",
  storageBucket: "schedular-with-firebase.firebasestorage.app",
  messagingSenderId: "568133449093",
  appId: "1:568133449093:web:80c8a4ef3f33218cb180ec",
  measurementId: "G-TFTVY3DXRF"
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