import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin, map } from 'rxjs';
import { TransaktionListeComponent } from '../transaktion-liste/transaktion-liste.component';
import { AuthService } from '../AuthService';
import { MatDialog } from '@angular/material/dialog';
import { KaufenDialogComponent } from '../kaufen-dialog/kaufen-dialog.component';

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
  depotID: number = 0;
  isLoading = false;
  initalLoading = true;
  isin: string = '';
  anzahl: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  formSubmitted: boolean = false;
  stockSaved: boolean = false;
  currentPrice: number = 0;
  private apiKey: string = "co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g";
  private apiUrl: string = "https://finnhub.io/api/v1/search";
  symbols: any[] = [];


  constructor(private http: HttpClient, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {
    this.initalLoading = true;
    this.loadDepotID(() => {
      this.errorMessage = '';
      this.successMessage = '';
      this.stockSaved = false;
      this.currentPrice = 0;
    });
  }

  loadDepotID(callback: () => void) {
    const token = this.authService.getToken();
    if (token !== null && token !== '') {
      forkJoin([
        this.authService.getDepotIDFromToken(token)
      ]).subscribe(([depotID]) => {
        if (depotID !== 0 && depotID !== null) {
          this.depotID = depotID;
        }
        callback();
      });
    }
  };



  searchSymbols(inputValue: string) {
    this.isLoading = true;
    this.initalLoading = false;
    const query = inputValue.trim();
    if (query !== '') {
      const url: string = `${this.apiUrl}?q=${query}&token=${this.apiKey}`;
      this.http.get<any>(url).subscribe(response => {
        if (response && response.result) {
          this.symbols = response.result.filter((symbol: { symbol: string; type: string }) => {
            return /^[A-Za-z]+$/.test(symbol.symbol) && symbol.type === 'Common Stock';
          });
  
          let requestsCompleted = 0; // Zähler für abgeschlossene Anfragen
  
          if(this.symbols.length > 0){
            this.symbols.forEach((symbol: any) => {
              this.getCurrentPrice(symbol.symbol).subscribe(price => {
                // Überprüfen, ob der Preis größer oder gleich 0.01 ist
                if (price >= 0.01) {
                  symbol.price = price; // Speichern des Preises im Symbolobjekt
                  requestsCompleted++;
  
                  // Überprüfen, ob alle Preise abgerufen wurden
                  if (requestsCompleted === this.symbols.length) {
                    this.isLoading = false;
                    this.initalLoading = false;
                    // Hier fortfahren mit dem Code, z. B. weitere Verarbeitung oder Anzeige
                  }
                } else {
                  // Wenn der Preis kleiner als 0.01 ist, entfernen Sie das Symbol aus dem Array
                  const index = this.symbols.indexOf(symbol);
                  if (index > -1) {
                    this.symbols.splice(index, 1);
                  }
                  requestsCompleted++;
                }
              });
            });
          }
          if(this.symbols.length === 0){
            this.isLoading = false;
            this.initalLoading = false;
          }
        } else {
          this.symbols = [];
          this.isLoading = false; // Setzen Sie isLoading auf false, auch wenn keine Symbole gefunden wurden
          this.initalLoading = false;
        }
      });
    } else {
      this.symbols = [];
      this.isLoading = false; // Setzen Sie isLoading auf false, wenn die Abfrage leer ist
      this.initalLoading = false;
    }
  }



  getCurrentPrice(symbol: string): Observable<number> {
    const apiKey = "cp0edihr01qnigejvsigcp0edihr01qnigejvsj0";
    const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    return this.http.get<any>(apiUrl).pipe(
      map(response => response.c)

    );

  }



  setSelectedSymbol(symbol: string) {
    this.isin = symbol;
    this.symbols = []; // Um die Dropdown-Liste zu schließen, nachdem ein Symbol ausgewählt wurde
  }



  openKaufenPopup(item: any) {
    const dialogRef = this.dialog.open(KaufenDialogComponent, {
      data: {
        symbol: item.symbol,
        vorhandeneAnzahl: item.anzahl,
        depotID: this.depotID,
        price: item.price
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != null && result === 'Aktie erfolgreich gekauft!') {
        console.log("Aktienkauf erfolgreich!");
      } else if (result != null && result.includes('Kauf fehlgeschlagen')) {
        console.log("Fehler beim Aktienkauf!");
      }
    });
  }


}