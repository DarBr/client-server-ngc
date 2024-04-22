import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token === null) {
      this.router.navigate(['login']);
      return false;
    }
    if (!this.authService.validateToken(token)) {
      this.router.navigate(['login']);
      return false;
    }
    
    return true;
  }
}