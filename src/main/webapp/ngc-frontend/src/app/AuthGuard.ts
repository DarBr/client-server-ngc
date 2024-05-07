import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './AuthService';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const token = this.authService.getToken();
    if (token === null) {
      this.router.navigate(['login']);
      return false;
    }
    const isValid = await this.authService.validateToken(token);
    if (!isValid) {
      this.router.navigate(['login']);
      this.authService.deleteToken();
      return false;
    }
    return true;
  }
}