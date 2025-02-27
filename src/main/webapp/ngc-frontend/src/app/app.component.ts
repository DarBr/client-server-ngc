import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './AuthService';
import { MatDialogModule } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { AdminNavbarComponent } from './admin-dashboard/admin-navbar.component'; // Da admin-navbar.component.ts im Ordner admin-dashboard liegt

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    AdminNavbarComponent
  ]
})
export class AppComponent {
  isLoginPage: boolean = false;
  title = 'ngc-frontend';
  username: string | null = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = (event.url === '/login');
      }
    });
  }

  async ngOnInit() {
    const token = this.authService.getToken();
    if (token !== null && token !== '') {
      this.username = await this.authService.getUsernameFromToken(token);
      this.isAdmin = (this.username?.toLowerCase() === 'admin');
    } else {
      this.username = 'Login';
    }
  }
}
