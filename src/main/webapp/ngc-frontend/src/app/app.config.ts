import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './CustomReuseStrategy'; // Stelle sicher, dass der Pfad korrekt ist

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { JwtInterceptor } from './JwtInterceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTPErrorInterceptor } from './HTTPErrorInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, 
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: HTTPErrorInterceptor, multi: true }
  ]
};
