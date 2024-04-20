import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, tap } from 'rxjs';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  depots: any[] = [];
  isLoading = true;
  sortColumn: string = '';
  sortAscending: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadDepot();
  }

  loadDepot() {
    this.isLoading = true; // Setze isLoading auf true, um anzuzeigen, dass das Laden begonnen hat
    this.http.get<any[]>('http://localhost:8080/depot').subscribe((data) => {
      const depots = data;
  
      const priceObservables = depots.map(depot =>
        this.getAktienpreis(depot.isin).pipe(
          map((stockPrice) => {
            depot.currentPrice = stockPrice;
            depot.changeTotal = this.calculateChangeTotal(depot); // Berechne die Wertänderung - Total
            depot.changeProzent = this.calculateChangeProzent(depot); // Berechne die Wertänderung - Prozentual
  
            return depot;
          })
        )
      );
  
      forkJoin(priceObservables).subscribe((updatedDepots) => {
        this.depots = updatedDepots; // Weise das aktualisierte Array zu, um die Änderungserkennung auszulösen
        this.isLoading = false; // Setze isLoading auf false, um anzuzeigen, dass das Laden abgeschlossen ist
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
}