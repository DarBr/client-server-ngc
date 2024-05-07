import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../AuthService';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EinzahlenDialogComponent } from '../einzahlen-dialog/einzahlen-dialog.component';


@Component({
  selector: 'app-verrechnungskonto',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './verrechnungskonto.component.html',
  styleUrl: './verrechnungskonto.component.css'
})
export class VerrechnungskontoComponent implements OnInit{
  zahlungen: any[] = []; // Hier wird das Array initialisiert
  isLoading = true;
  keineZahlungen = false;
  sortColumn: string = '';
  sortAscending: boolean = true;
  userID: number = 0;
  kontoID: number = 0;
  kontostand: number = 0;

  constructor(private http: HttpClient, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadUserIDs(() => {
      this.loadKontostand();
      this.loadTransactions();
    });
  }

  loadUserIDs(callback: () => void){
    const token = this.authService.getToken();
    if(token !== null && token !== '') {
      forkJoin([
        this.authService.getUserIDFromToken(token),
        this.authService.getKontoIDFromToken(token)
      ]).subscribe(([userID, kontoID]) => {
        if (userID !== 0 && userID !== null) {
          this.userID = userID;
        }
        if (kontoID !== 0 && kontoID !== null) {
          this.kontoID = kontoID;
        }
        callback();
      });
    }
  };


  // Lade die Transaktionen
  loadTransactions() {
    this.http.get<any[]>(`http://localhost:8080/zahlungen/zahlungenByKontoID/${this.kontoID}`).subscribe((data) => {
      this.zahlungen = data.sort((a, b) => {
        return new Date(b.zeitpunkt).getTime() - new Date(a.zeitpunkt).getTime();
      });
      this.isLoading = false;
      if (this.zahlungen.length === 0) {
        this.keineZahlungen = true;
      }
      if (this.zahlungen.length > 0) {
        this.keineZahlungen = false;
      }
    });
  }

  // Sortiere die Tabelle
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
    }

    this.sortColumn = column;

    this.zahlungen.sort((a, b) => {
      let comparison = 0;
      if (a[column] > b[column]) {
        comparison = 1;
      } else if (a[column] < b[column]) {
        comparison = -1;
      }
      return this.sortAscending ? comparison : comparison * -1;
    });
  }

  loadKontostand() {
    this.http.get<any>(`http://localhost:8080/konto/${this.kontoID}`).subscribe((data) => {
      this.kontostand = Math.round(data.kontostand * 100) / 100;
    });
  }

  openDepositPopup() {
    const einzahlungsbetrag = prompt("Bitte geben Sie den einzuzahlenden Betrag ein:");
    if (einzahlungsbetrag !== null) {
      const betrag = parseFloat(einzahlungsbetrag);
      if (!isNaN(betrag) && betrag > 0) {
        this.einzahlen(betrag);
      } else {
        alert("Bitte geben Sie einen gültigen Betrag ein.");
      }
    }
  }

  openEinzahlenPopup() {
    const dialogRef = this.dialog.open(EinzahlenDialogComponent, {
      data: {
        kontoID: this.kontoID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null && result === 'Aktie erfolgreich verkauft!') {
        this.loadKontostand();
      } else {
        console.log(result);
      }
    });
  }

  openWithdrawalPopup() {
    const auszahlungsbetrag = prompt("Bitte geben Sie den auszuzahlenden Betrag ein:");
    if (auszahlungsbetrag !== null) {
      const betrag = parseFloat(auszahlungsbetrag);
      if (!isNaN(betrag) && betrag > 0) {
        this.auszahlen(betrag);
      } else {
        alert("Bitte geben Sie einen gültigen Betrag ein.");
      }
    }
  }

  einzahlen(betrag: number) {
    // Hier kannst du die Logik für die Einzahlung implementieren, z.B. eine HTTP-Anfrage an den Server senden
    this.http.put(`http://localhost:8080/konto/einzahlen?kontoID=${this.kontoID}&betrag=${betrag}`, {}).subscribe((response) => {
      console.log("Einzahlung erfolgreich:", response);
      this.loadKontostand();
      this.loadTransactions();
    }, (error) => {
      console.error("Fehler bei der Einzahlung:", error);
    });
  }


  auszahlen(betrag: number) {
    this.http.put(`http://localhost:8080/konto/auszahlen?kontoID=${this.kontoID}&betrag=${betrag}`, {}).subscribe((response) => {
      console.log("Auszahlen erfolgreich:", response);
      this.loadKontostand();
      this.loadTransactions();
    }, (error) => {
      console.error("Fehler bei der Einzahlung:", error);
    });

  }
}
