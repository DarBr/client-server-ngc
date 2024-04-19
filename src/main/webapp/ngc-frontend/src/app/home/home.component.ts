import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';


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
    this.http.get<any[]>('http://localhost:8080/depot').subscribe((data) => {
      this.depots = data;
      this.isLoading = false;

      this.depots.forEach((depot) => {
        this.getAktienpreis(depot.isin).subscribe((price) => {
          depot.currentPrice = price;
        });
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