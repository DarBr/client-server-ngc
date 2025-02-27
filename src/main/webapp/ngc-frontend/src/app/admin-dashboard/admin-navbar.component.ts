import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  template: `
    <nav class="admin-navbar">
      <ul>
        <li>
          <a routerLink="/admin/dashboard" routerLinkActive="active-link">Dashboard</a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .admin-navbar {
      background-color: #333;
      padding: 10px;
    }
    .admin-navbar ul {
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0;
    }
    .admin-navbar li {
      margin-right: 20px;
    }
    .admin-navbar a {
      color: #fff;
      text-decoration: none;
    }
    .admin-navbar a.active-link {
      font-weight: bold;
      text-decoration: underline;
    }
  `],
  imports: [RouterModule]
})
export class AdminNavbarComponent {}
