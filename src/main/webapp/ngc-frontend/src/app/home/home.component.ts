import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, tap, throwError } from 'rxjs';
import { 
  Chart, 
  ChartConfiguration, 
  ChartData, 
  ChartTypeRegistry, 
  PieController, 
  ArcElement, 
  Tooltip, 
  TooltipItem,
  Legend 
} from 'chart.js';
import { AuthService } from '../AuthService';
import { MatDialog } from '@angular/material/dialog';
import { VerkaufenDialogComponent } from '../verkaufen-dialog/verkaufen-dialog.component';

// Register the components for the pie chart
Chart.register(PieController, ArcElement, Tooltip, Legend);




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  userID: number = 0;
  depotID: number = 0;
  depots: any[] = [];
  keineDepots = false;
  isLoading = true;
  sortColumn: string = '';
  sortAscending: boolean = true;
  kontostand: number = 0;
  portfolioDistributionChart: Chart<'pie', number[], string> | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private dialog:MatDialog) { }

  ngOnInit() {

    this.loadUserIDs(() => {
      this.loadDepot(()=> {
        this.calculatePortfolioValue();
        this.createPortfolioDistributionChart();
      });
    });    
  }

  loadUserIDs(callback: () => void){
    const token = this.authService.getToken();
    if(token !== null && token !== '') {
      forkJoin([
        this.authService.getUserIDFromToken(token),
        this.authService.getDepotIDFromToken(token)
      ]).subscribe(([userID, depotID]) => {
        if (userID !== 0 && userID !== null) {
          this.userID = userID;
        }
        if (depotID !== 0 && depotID !== null) {
          this.depotID = depotID;
        }
        callback();
      });
    }
  };

  loadDepot(callback: () => void) {
    this.depots = [];
    this.isLoading = true;

    this.http.get<any[]>(`http://localhost:8080/depot/${this.depotID}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.status === 404) {
          this.keineDepots = true;
        }
        callback();
        return throwError('Noch keine Aktien im Depot vorhanden.');
      })
    ).subscribe((data) => {
      const depots = data;

      const observables = depots.map(depot => {
        return forkJoin([
          this.getAktienpreis(depot.isin),
          this.getLogo(depot.isin)
        ]).pipe(
          map(([stockPrice, logo]) => {
            depot.currentPrice = stockPrice;
            depot.changeTotal = this.calculateChangeTotal(depot);
            depot.changeProzent = this.calculateChangeProzent(depot);
            depot.logo = logo;

            return depot;
          })
        );
      });

      forkJoin(observables).subscribe((updatedDepots) => {
        this.depots = updatedDepots;
        this.isLoading = false;
        if (this.depots.length === 0) {
          this.keineDepots = true;
        }
        callback();
      });
    });
  }

  getAktienpreis(isin: string): Observable<number> {
    const apiKey = 'cohccfhr01qrf6b2m2p0cohccfhr01qrf6b2m2pg';
    const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${isin}&token=${apiKey}`;

    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        if (response && response.c) {
          const stockPrice = response.c;
          return Math.round(stockPrice * 100) / 100;
        } else {
          throw new Error('Fehler beim Abrufen des Aktienpreises.');
        }
      })
    );
  }

  getLogo(isin: string): Observable<string> {
    const apiKey = "co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g";
    const url =  `https://finnhub.io/api/v1//stock/profile2?symbol=${isin}&token=${apiKey}`;
  
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.logo) {
          return response.logo;
        } else {
          // Wenn kein Logo gefunden wird, gib das eigene Logo zurück
          return "assets/ngc-logo.jpg";
        }
      }),
      catchError(error => {
        // Bei einem Fehler den Standard-URL zurückgeben
        return "assets/ngc-logo.jpg";
      })
    );
  }
  

  calculateChangeTotal(item: any): number {
    // Berechne die Wertänderung als Differenz zwischen dem aktuellen Wert und dem Einstandspreis
    const originalInvestment = item.einstandspreis * item.anzahl;
    const currentValue = item.currentPrice * item.anzahl;
    return Math.round((currentValue - originalInvestment) * 100) / 100;
  }

  calculateChangeProzent(item: any): number {
    // Berechne die prozentuale Wertänderung als Differenz zwischen dem aktuellen Wert und dem Einstandspreis
    const originalInvestment = item.einstandspreis * item.anzahl;
    const currentValue = item.currentPrice * item.anzahl;
    const prozent = Math.round((currentValue / originalInvestment) * 10000) / 100;
    return Math.round((prozent - 100) * 100) / 100;
  }

  totalChangeTotal(): number {
    return Math.round(this.depots.reduce((total, depot) => total + depot.changeTotal, 0) * 100) / 100;
  }

  totalChangeProzent(): number {
    const totalChange = this.depots.reduce((total, depot) => total + depot.changeTotal, 0);
    const originalInvestment = this.depots.reduce((total, depot) => total + depot.einstandspreis * depot.anzahl, 0);
    const currentValue = originalInvestment + totalChange;
    const prozent = Math.round((currentValue / originalInvestment) * 10000) / 100;
    return Math.round((prozent - 100) * 100) / 100;
  }

  calculatePortfolioValue(): number {
    let totalValue = 0;
    this.depots.forEach(depot => {
      // Wenn der Aktienkurs und die Anzahl der Aktien vorhanden sind, berechne den Wert des Depots
      if (depot.currentPrice && depot.anzahl) {
        totalValue += depot.currentPrice * depot.anzahl;
      }
    });
    return Math.round(totalValue * 100) / 100; // Runden Sie den Gesamtwert auf zwei Dezimalstellen
  }
  
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
    }

    this.sortColumn = column;

    this.depots.sort((a, b) => {
      let comparison = 0;
      if (a[column] > b[column]) {
        comparison = 1;
      } else if (a[column] < b[column]) {
        comparison = -1;
      }
      return this.sortAscending ? comparison : comparison * -1;
    });
  }
  
  createPortfolioDistributionChart() {
    if (!this.isLoading && this.depots.length && !this.keineDepots) {
      const labels = this.depots.map(depot => depot.isin);
      const data = this.depots.map(depot => Math.round((depot.currentPrice || 0) * (depot.anzahl || 0) * 100) / 100);
      const backgroundColors = this.generateBackgroundColors(data.length);
      const borderColors = this.generateBorderColors(data.length);
  
      const chartData: ChartData<'pie', number[], string> = {
        labels: labels,
        datasets: [{
          label: 'Portfolio Distribution',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      };
  
      const config: ChartConfiguration<'pie', number[], string> = {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context: TooltipItem<'pie'>) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                  const percentage = ((value / total) * 100).toFixed(2) + '%';
                  return `${label}: ${value} (${percentage})`;
                }
              }
            }
          }
        },
      };
  
      if (this.portfolioDistributionChart) {
        this.portfolioDistributionChart.destroy();
      }
  
      this.portfolioDistributionChart = new Chart<'pie', number[], string>(
        document.getElementById('portfolioDistributionChart') as HTMLCanvasElement,
        config
      );
    }
  }

  // Helper method to generate background colors
  generateBackgroundColors(count: number): string[] {
    const palette = [
      'rgba(52, 152, 219, 0.8)', // Soft Blue
      'rgba(231, 76, 60, 0.8)', // Soft Red
      'rgba(46, 204, 113, 0.8)', // Mint Green
      'rgba(155, 89, 182, 0.8)', // Lavender
      'rgba(241, 196, 15, 0.8)', // Mustard Yellow
      'rgba(230, 126, 34, 0.8)', // Peach
      'rgba(236, 240, 241, 0.8)', // Light Gray
      'rgba(149, 165, 166, 0.8)', // Slate
      'rgba(26, 188, 156, 0.8)', // Sea Green
      'rgba(52, 73, 94, 0.8)' // Dark Slate
    ];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  }

  // Helper method to generate border colors
  generateBorderColors(count: number): string[] {
    const palette = [
      'rgba(52, 152, 219, 0.8)', // Soft Blue
      'rgba(231, 76, 60, 0.8)', // Soft Red
      'rgba(46, 204, 113, 0.8)', // Mint Green
      'rgba(155, 89, 182, 0.8)', // Lavender
      'rgba(241, 196, 15, 0.8)', // Mustard Yellow
      'rgba(230, 126, 34, 0.8)', // Peach
      'rgba(236, 240, 241, 0.8)', // Light Gray
      'rgba(149, 165, 166, 0.8)', // Slate
      'rgba(26, 188, 156, 0.8)', // Sea Green
      'rgba(52, 73, 94, 0.8)' // Dark Slate
    ];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  }

  openVerkaufenPopup(item: any) {
    const dialogRef = this.dialog.open(VerkaufenDialogComponent, {
      data: {
        isin: item.isin,
        vorhandeneAnzahl: item.anzahl,
        depotID: this.depotID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null && result === 'Aktie erfolgreich verkauft!') {
        this.loadDepot(() => {
          this.calculatePortfolioValue();
          this.createPortfolioDistributionChart();
        });
      }else{
        console.log(result);
      }
    });
  }

}


