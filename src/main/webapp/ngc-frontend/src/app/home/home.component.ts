import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import moment from 'moment-timezone';
import 'moment/locale/de';
moment.locale('de');
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
import { environment } from '../../environments/environment';

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

  private apiUrl = environment.apiPath

  marketStatus: string = '';
  nextOpenTime: string = '';
  userID: number = 0;
  depotID: number = 0;
  kontoID: number = 0;
  depots: any[] = [];
  keineDepots = false;
  isLoading = true;
  sortColumn: string = '';
  sortAscending: boolean = true;
  kontostand: number = 0;
  portfolioDistributionChart: Chart<'pie', number[], string> | null = null;
  industryDistributionChart: Chart<'pie', number[], string> | null = null;
  activeTab = 'portfolioDistributionChart';


  constructor(private http: HttpClient, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {

    this.loadUserIDs(() => {
      this.loadKontostand(() => {
        this.loadDepotData(() => {
          this.addCashToDepot(() => {
            this.calculatePortfolioValue();
            this.createPortfolioDistributionChart();
            this.createIndustryDistributionChart();
            this.checkMarketStatus();
          }

          );
        });
      });

    });


  }




  loadUserIDs(callback: () => void) {
    const token = this.authService.getToken();
    if (token !== null && token !== '') {
      forkJoin([
        this.authService.getUserIDFromToken(token),
        this.authService.getDepotIDFromToken(token),
        this.authService.getKontoIDFromToken(token)
      ]).subscribe(([userID, depotID, kontoID]) => {
        if (userID !== 0 && userID !== null) {
          this.userID = userID;
        }
        if (depotID !== 0 && depotID !== null) {
          this.depotID = depotID;
        }
        if (kontoID !== 0 && kontoID !== null) {
          this.kontoID = kontoID;
        }

        callback();
      });
    }
  };

  loadDepotData(callback: () => void) {
    this.depots = [];
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/depot/${this.depotID}`).pipe(
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
          this.getAktienPreise(depot.isin),
          this.getStockProfile(depot.isin) // Hinzugefügt, um Stockprofile zu erhalten
        ]).pipe(
          map(([aktienDetails, stockProfile]) => {
            depot.currentPrice = Math.round(aktienDetails.c * 100) / 100;
            depot.changeTotal = Math.round(this.calculateChangeTotal(depot) * 100) / 100;
            depot.changeProzent = Math.round(this.calculateChangeProzent(depot) * 100) / 100;
            depot.logo = stockProfile.logo;
            depot.c = Math.round(aktienDetails.c * 100) / 100;
            depot.h = Math.round(aktienDetails.h * 100) / 100;
            depot.l = Math.round(aktienDetails.l * 100) / 100;
            depot.d = Math.round(aktienDetails.d * 100) / 100;
            depot.dp = Math.round(aktienDetails.dp * 100) / 100;


            // Aktualisieren der Depotdetails mit Stockprofile-Informationen
            depot.country = stockProfile.country;
            depot.currency = stockProfile.currency;
            depot.estimateCurrency = stockProfile.estimateCurrency;
            depot.exchange = stockProfile.exchange;
            depot.finnhubIndustry = stockProfile.finnhubIndustry;
            depot.ipo = stockProfile.ipo;
            depot.marketCapitalization = stockProfile.marketCapitalization;
            depot.name = stockProfile.name;
            depot.phone = stockProfile.phone;
            depot.shareOutstanding = stockProfile.shareOutstanding;
            depot.ticker = stockProfile.ticker;
            depot.weburl = stockProfile.weburl;

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

  checkMarketStatus() {
    const apiKey = "co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g";
    const url = `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${apiKey}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        const nowEST = moment().tz('America/New_York');
        const openEST = moment().tz('America/New_York').set({ hour: 9, minute: 30, second: 0 });
        const closeEST = moment().tz('America/New_York').set({ hour: 16, minute: 0, second: 0 });

        if (response.isOpen) {
          this.marketStatus = 'Die Börse ist aktuell geöffnet.';
          this.nextOpenTime = closeEST.clone().tz('Europe/Berlin').format('dddd, D. MMMM YYYY, HH:mm:ss [Uhr]');
        } else {
          this.marketStatus = 'Die Börse ist geschlossen.';
          if (nowEST.isAfter(closeEST)) {
            // Überprüfen, ob heute Freitag oder Wochenende ist
            const currentDay = nowEST.day();
            if (currentDay === 5) { // Freitag
              openEST.add(3, 'days'); // Springe zu Montag
            } else if (currentDay === 6) { // Samstag
              openEST.add(2, 'days'); // Springe zu Montag
            } else if (currentDay === 0) { // Sonntag
              openEST.add(1, 'day'); // Springe zu Montag
            } else {
              openEST.add(1, 'day'); // Nächster Tag, falls nicht Wochenende
            }
          }
          this.nextOpenTime = openEST.clone().tz('Europe/Berlin').format('dddd, D. MMMM YYYY, HH:mm:ss [Uhr]');
        }
      },
      error: () => {
        this.marketStatus = 'Fehler beim Laden des Marktstatus.';
        this.nextOpenTime = 'Zeit nicht verfügbar. Bitte später prüfen.';
      }
    });
  }

  openTab(tabId: string) {
    this.activeTab = tabId;
  }



  getAktienPreise(isin: string): Observable<any> {
    const apiKey = "cp0edihr01qnigejvsigcp0edihr01qnigejvsj0";
    const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${isin}&token=${apiKey}`;

    return this.http.get<any>(apiUrl);
  }

  getStockProfile(symbol: string): Observable<any> {
    const apiKey = "cp0eejhr01qnigejvvagcp0eejhr01qnigejvvb0";
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response) {
          // Extrahiere die relevanten Informationen aus der API-Antwort
          const profile = {
            country: response.country,
            currency: response.currency,
            estimateCurrency: response.estimateCurrency,
            exchange: response.exchange,
            finnhubIndustry: response.finnhubIndustry,
            ipo: response.ipo,
            logo: response.logo || "assets/logo.png",
            marketCapitalization: response.marketCapitalization,
            name: response.name,
            phone: response.phone,
            shareOutstanding: response.shareOutstanding,
            ticker: response.ticker,
            weburl: response.weburl
          };
          return profile;
        } else {
          throw new Error('Fehler beim Abrufen des Aktienprofils.');
        }
      })
    );
  }






  toggleDetails(item: any): void {
    item.showDetails = !item.showDetails;
  }

  loadKontostand(callback: () => void) {
    this.http.get<any>(`${this.apiUrl}/konto/${this.kontoID}`).subscribe((data) => {
      this.kontostand = Math.round(data.kontostand * 100) / 100;
      this.isLoading = false;
      callback();
    });
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
    return Math.round(totalValue * 100) / 100;
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

    // Move CASH to the last position
    const cashIndex = this.depots.findIndex(depot => depot.isin === 'CASH');
    if (cashIndex !== -1) {
      const cashDepot = this.depots.splice(cashIndex, 1)[0];
      this.depots.push(cashDepot);
    }
  }


  addCashToDepot(callback: () => void) {
    this.loadKontostand(() => {
      // Dummy-Objekt für CASH erstellen
      const cashData = {
        isin: 'CASH',
        currentPrice: this.kontostand,
        anzahl: 1,
        logo: "assets/credit-card-vector-icon-isolated-600nw-1177277911.webp",
        einstandspreis: this.kontostand,
        changeTotal: 0,
        changeProzent: 0,
        finnhubIndustry: 'CASH'
      };

      // Hinzufügen von CASH zu den Portfolio-Daten
      this.depots.push(cashData);

      // Aufruf der Callback-Funktion, um anzuzeigen, dass das CASH erfolgreich hinzugefügt wurde
      callback();
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
                label: function (context: TooltipItem<'pie'>) {
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

  createIndustryDistributionChart() {
    const industryData = this.depots.reduce((acc: { [key: string]: number }, depot) => {
      const industry = depot.finnhubIndustry as string;
      const value = typeof depot.currentPrice === 'number' ? depot.currentPrice * depot.anzahl : 0;
      acc[industry] = (acc[industry] || 0) + value;
      return acc;
    }, {});
  
    const labels = Object.keys(industryData);
    const data = Object.values(industryData);
  
    const backgroundColors = this.generateBackgroundColors(data.length);
    const borderColors = this.generateBorderColors(data.length);
  
    const chartData: ChartData<'pie', number[], string> = {
      labels: labels,
      datasets: [{
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
              label: function (context: TooltipItem<'pie'>) {
                const label = context.label;
                const value = (context.parsed as number).toFixed(2); // Runden der absoluten Werte
                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                const percentage = ((parseFloat(value) / total) * 100).toFixed(2) + '%'; // Runden der Prozentzahlen
                return `${label}: ${value} (${percentage})`;
              }
            }
          }
        }
      }
    };
  
    if (this.industryDistributionChart) {
      this.industryDistributionChart.destroy();
    }
  
    this.industryDistributionChart = new Chart(
      document.getElementById('industryDistributionChart') as HTMLCanvasElement,
      config
    );
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
      'rgba(52, 73, 94, 0.8)', // Dark Slate
      'rgba(255, 0, 0, 0.5)', // Transparent Red
      'rgba(0, 255, 0, 0.5)', // Transparent Green
      'rgba(0, 0, 255, 0.5)', // Transparent Blue
      'rgba(255, 255, 0, 0.5)', // Transparent Yellow
      'rgba(255, 0, 255, 0.5)', // Transparent Magenta
      'rgba(0, 255, 255, 0.5)', // Transparent Cyan
      'rgba(128, 0, 0, 0.5)', // Transparent Maroon
      'rgba(0, 128, 0, 0.5)', // Transparent Green
      'rgba(0, 0, 128, 0.5)', // Transparent Navy
      'rgba(128, 128, 0, 0.5)' // Transparent Olive
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
      'rgba(52, 73, 94, 0.8)', // Dark Slate
      'rgba(255, 0, 0, 0.5)', // Transparent Red
      'rgba(0, 255, 0, 0.5)', // Transparent Green
      'rgba(0, 0, 255, 0.5)', // Transparent Blue
      'rgba(255, 255, 0, 0.5)', // Transparent Yellow
      'rgba(255, 0, 255, 0.5)', // Transparent Magenta
      'rgba(0, 255, 255, 0.5)', // Transparent Cyan
      'rgba(128, 0, 0, 0.5)', // Transparent Maroon
      'rgba(0, 128, 0, 0.5)', // Transparent Green
      'rgba(0, 0, 128, 0.5)', // Transparent Navy
      'rgba(128, 128, 0, 0.5)' // Transparent Olive
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
        this.loadUserIDs(() => {
          this.loadKontostand(() => {
            this.loadDepotData(() => {
              this.addCashToDepot(() => {
                this.calculatePortfolioValue();
                this.createPortfolioDistributionChart();
                this.createIndustryDistributionChart();
                this.checkMarketStatus();
              }

              );
            });
          });

        });
      } else {
        console.log(result);
      }
    });
  }



}


