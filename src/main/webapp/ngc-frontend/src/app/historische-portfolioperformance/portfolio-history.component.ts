import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, ChartData, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { AuthService } from '../AuthService';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-portfolio-history',
  templateUrl: './portfolio-history.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./portfolio-history.component.css'], 
})
export class PortfolioHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('portfolioLineChart') canvasRef!: ElementRef<HTMLCanvasElement>;

  username: string | null = null;
  depotID: number | null = null;
  snapshots: any[] = [];
  isLoading = true;
  errorMessage = '';
  private apiUrl = environment.apiPath;
  private lineChart: Chart<'line'> | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, TimeScale);
  }

  async ngOnInit(): Promise<void> {
    const token = this.authService.getToken();

    if (token) {
      this.username = await this.authService.getUsernameFromToken(token);
      this.depotID = await this.authService.getDepotIDFromToken(token);
    }

    console.log('Eingeloggter Benutzer:', this.username);
    console.log('Depot-ID:', this.depotID);

    if (this.depotID) {
      this.loadPortfolioSnapshots();
    }
  }

  ngAfterViewInit(): void {
    if (!this.isLoading) {
      setTimeout(() => {
        if (this.snapshots.length > 0) {
          this.createLineChart();
        }
      }, 500);
    }
  }

  loadPortfolioSnapshots(): void {
    if (!this.depotID) {
      this.errorMessage = 'Keine gültige Depot-ID vorhanden.';
      this.isLoading = false;
      return;
    }

    
    this.http.get<any[]>(`${this.apiUrl}/portfolio/snapshots/${this.depotID}`)
      .subscribe({
        next: (data) => {
          this.snapshots = data;
          this.isLoading = false;

          console.log('Geladene Snapshots:', this.snapshots);

          setTimeout(() => {
            if (this.snapshots.length > 0) {
              this.createLineChart();
            }
          }, 0);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Fehler beim Laden der Portfolio-Snapshots.';
          console.error(err);
        }
      });
}


createLineChart(): void {
  if (!this.snapshots || this.snapshots.length === 0) {
    return;
  }

  // Sortiere nach Zeit
  this.snapshots.sort((a, b) => new Date(a.snapshotTime).getTime() - new Date(b.snapshotTime).getTime());

  // Zeitpunkte und Werte extrahieren
  const labels = this.snapshots.map(s => new Date(s.snapshotTime));
  const dataValues = this.snapshots.map(s => s.portfolioValue);

  // Zeit-Einheit automatisch bestimmen
  let timeUnit: 'minute' | 'hour' | 'day' | 'month' = 'day';
  const diffInHours = (labels[labels.length - 1].getTime() - labels[0].getTime()) / (1000 * 60 * 60);

  if (diffInHours < 6) {
    timeUnit = 'minute';
  } else if (diffInHours < 48) {
    timeUnit = 'hour';
  } else if (diffInHours < 720) {
    timeUnit = 'day';
  } else {
    timeUnit = 'month';
  }

  const chartData: ChartData<'line'> = {
    labels: labels,
    datasets: [
      {
        label: 'Portfolio-Wert',
        data: dataValues,
        borderColor: 'rgba(102, 51, 153, 1)', // Lila wie im Beispiel
        backgroundColor: 'rgba(102, 51, 153, 0.2)',
        borderWidth: 2,
        pointRadius: labels.length > 20 ? 0 : 4, // Punkte nur anzeigen, wenn wenige Datenpunkte
        tension: 0.4, // Glättet die Kurven leicht
        fill: false,
      }
    ]
  };

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: timeUnit,
            tooltipFormat: 'dd.MM.yyyy HH:mm:ss',
            displayFormats: {
              minute: 'HH:mm',
              hour: 'dd.MM HH:mm',
              day: 'dd.MM.yyyy',
              month: 'MM.yyyy'
            }
          },
          ticks: {
            autoSkip: true, // Reduziert überfüllte Labels
            maxRotation: 45,
            minRotation: 20,
          },
          title: {
            display: true,
            text: 'Snapshot-Zeitpunkt'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Portfoliowert in $'
          },
          beginAtZero: false
        }
      },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y || 0;
              return `Wert: ${value.toFixed(2)} $`;
            }
          }
        }
      }
    }
  };

  if (this.lineChart) {
    this.lineChart.destroy();
  }

  const canvas = this.canvasRef.nativeElement;
  this.lineChart = new Chart(canvas, config);
}


}
