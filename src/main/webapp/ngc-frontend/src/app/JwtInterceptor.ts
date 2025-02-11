import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private apiUrl = environment.apiPath;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // holen Sie den Token aus dem Local Storage
        let token = localStorage.getItem('token');

        if (token && request.url.startsWith(this.apiUrl)) {
        // wenn der Token existiert und die URL übereinstimmt, fügen Sie ihn in den Authorization-Header ein
        request = request.clone({
            setHeaders: { 
                Authorization: `Bearer ${token}`
            }
        });
        }

        // leiten Sie die Anfrage weiter
        return next.handle(request);
    }
}
