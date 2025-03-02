import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private apiUrl = environment.apiPath; // Beispiel: "http://localhost:8080"

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("DEBUG: apiUrl =", this.apiUrl);
    console.log("DEBUG: request.url =", request.url);

    let token = localStorage.getItem('token');
    console.log("DEBUG: token =", token);

    if (token && request.url.startsWith(this.apiUrl)) {
      console.log("DEBUG: Bedingung erfüllt, Header wird gesetzt");
      request = request.clone({
        setHeaders: { 
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log("DEBUG: Bedingung nicht erfüllt: Kein Token oder URL passt nicht");
    }

    return next.handle(request);
  }
}
