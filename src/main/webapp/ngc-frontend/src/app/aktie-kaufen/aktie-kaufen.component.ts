import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-aktie-kaufen',
  standalone: true,
  templateUrl: './aktie-kaufen.component.html',
  styleUrl: './aktie-kaufen.component.css',
  imports: [CommonModule, FormsModule]
})
export class AktieKaufenComponent {
  // Deklariere ein Ereignis
  @Output() transactionCompleted = new EventEmitter<void>();

  isin: string = '';
  anzahl: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  depotId: number = 123;
  formSubmitted: boolean = false;
  stockSaved: boolean = false;
  currentPrice: number = 0;
  private apiKey: string = "co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g";
  private apiUrl: string = "https://finnhub.io/api/v1/quote?symbol=";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.stockSaved = false;
    this.currentPrice = 0;
  }

  getCurrentPrice(symbol: string): Observable<number> {
    const url: string = `${this.apiUrl}${symbol}&token=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => response.c)
    );
  }

  kaufen() {
    this.errorMessage = '';
    const url = `http://localhost:8080/depot/kaufen?isin=${this.isin}&anzahl=${this.anzahl}&depotID=${this.depotId}`;

    this.http.post(url, {}).subscribe(response => {
      if (response === null) {
        this.errorMessage = 'Die Aktie konnte nicht gekauft werden.';
      } else {
        this.successMessage = 'Aktie wurde erfolgreich gekauft.';
        this.stockSaved = true;
        this.isin = '';
        this.anzahl = 0;
        // Löse das Ereignis aus, um die Transaktionsliste zu aktualisieren
        this.transactionCompleted.emit();
      }
    });
  }
}
