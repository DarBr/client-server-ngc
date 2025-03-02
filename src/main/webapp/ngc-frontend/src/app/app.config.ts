import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './CustomReuseStrategy';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './JwtInterceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTPErrorInterceptor } from './HTTPErrorInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Routing
    provideRouter(routes),

    // Für SSR/Client-Hydration (falls verwendet)
    provideClientHydration(),

    // Registriert HttpClient und Interceptors aus DI
    provideHttpClient(
      withInterceptorsFromDi()
    ),

    // Für custom Route Reuse (falls Du das brauchst)
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },

    // Registriert Deinen JwtInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    // Asynchrone Animationen
    provideAnimationsAsync(),

    // Registriert Deinen ErrorInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: HTTPErrorInterceptor, multi: true }
  ]
};
