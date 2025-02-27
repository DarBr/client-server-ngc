import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Für Pipes wie "number"
import { RouterModule } from '@angular/router';
import { AdminService, AdminUser } from '../AdminService';  // Passe den Pfad ggf. an
import { AdminNavbarComponent } from './admin-navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, RouterModule, AdminNavbarComponent]
})
export class AdminDashboardComponent implements OnInit {
  users: AdminUser[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getDashboardUsers().subscribe({
      next: (data: AdminUser[]) => {
        this.users = data;
      },
      error: () => {
        this.errorMessage = 'Fehler beim Laden der Nutzerdaten.';
      }
    });
  }

  deleteUser(user: AdminUser): void {
    if (confirm(`Möchten Sie den Nutzer ${user.username} wirklich löschen?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.successMessage = `Nutzer ${user.username} wurde gelöscht.`;
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: () => {
          this.errorMessage = `Fehler beim Löschen von ${user.username}.`;
        }
      });
    }
  }
}
