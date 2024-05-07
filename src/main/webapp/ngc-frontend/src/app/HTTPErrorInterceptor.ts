import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable()
export class HTTPErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Fange den HTTP-Request ab und führe die nächste Handlung durch
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.deleteToken();
          this.router.navigate(['/login']);
        }
        // Wirf den Fehler weiter, damit er auch in der aufrufenden Komponente verarbeitet werden kann
        return throwError(error);
      })
    );
  }
}
