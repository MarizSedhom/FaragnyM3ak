import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
 
    provideRouter(routes),
    provideHttpClient() 
  ,
  provideFirebaseApp(() => initializeApp({
    projectId: environment.FireBase.projectId,
    appId: environment.FireBase.appId,
    storageBucket: environment.FireBase.storageBucket,
    apiKey: environment.FireBase.apiKey,
    authDomain: environment.FireBase.authDomain,
    messagingSenderId: environment.FireBase.messagingSenderId
  })),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  provideDatabase(() => getDatabase())]
};
