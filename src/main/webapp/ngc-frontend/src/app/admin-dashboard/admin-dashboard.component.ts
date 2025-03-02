import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, AdminUser } from '../AdminService';  // Pfad anpassen
import { AdminNavbarComponent } from './admin-navbar.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { FormsModule } from '@angular/forms';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, RouterModule, AdminNavbarComponent, FormsModule, DecimalPipe]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  // Tabellen-Daten
  users: AdminUser[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  // Für das Balkendiagramm
  selectedPeriod: string = 'day'; // "day", "week", "month"
  signupData: { label: string, count: number }[] = [];

  private apiUrl = environment.apiPath; // z.B. "http://localhost:8080"
  private barChart: Chart<'bar'> | null = null;

  @ViewChild('signupBarChart') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private adminService: AdminService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    // Sobald das Canvas verfügbar ist, lade die Login-Statistiken
    this.loadSignupStats();
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

  // Lädt die Login-Statistiken vom Backend
  loadSignupStats(): void {
    this.http
      .get<{ label: string, count: number }[]>(`${this.apiUrl}/admin/stats/logins?period=${this.selectedPeriod}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error("Fehler beim Laden der Login-Statistiken", err);
          this.errorMessage = "Fehler beim Laden der Login-Statistiken";
          return of([]);
        })
      )
      .subscribe(data => {
        this.signupData = data;
        this.renderBarChart();
      });
  }

  // Wird aufgerufen, wenn der Nutzer die Periode (Tag/Woche/Monat) ändert
  onPeriodChange(): void {
    this.loadSignupStats();
  }

  renderBarChart(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
    const labels = this.signupData.map(item => item.label);
    const values = this.signupData.map(item => item.count);

    const canvas = this.canvasRef.nativeElement;
    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Anmeldungen',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          barThickness: 20,       // Feste Balkenbreite
          maxBarThickness: 30     // Maximale Balkenbreite
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Wichtig, damit das Diagramm den Container voll nutzt
        scales: {
          x: {
            title: { display: true, text: 'Zeitraum (Tag / Woche / Monat)' }
          },
          y: {
            title: { display: true, text: 'Anzahl Anmeldungen' },
            beginAtZero: true
          }
        }
      }
    });
  }
}
