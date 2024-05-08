import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../AuthService';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EinzahlenDialogComponent } from '../einzahlen-dialog/einzahlen-dialog.component';
import { AuszahlenDialogComponent } from '../auszahlen-dialog/auszahlen-dialog.component';


@Component({
  selector: 'app-verrechnungskonto',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './verrechnungskonto.component.html',
  styleUrl: './verrechnungskonto.component.css'
})
export class VerrechnungskontoComponent implements OnInit {
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
      this.loadZahlungen();
    });
  }

  loadUserIDs(callback: () => void) {
    const token = this.authService.getToken();
    if (token !== null && token !== '') {
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
  loadZahlungen() {
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



  openEinzahlenPopup() {
    const dialogRef = this.dialog.open(EinzahlenDialogComponent, {
      data: {
        kontoID: this.kontoID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.isLoading = true;
      this.loadKontostand();
      this.loadZahlungen();
      this.isLoading = false;

    });
  }

  openAuszahlenPopup() {
    const dialogRef = this.dialog.open(AuszahlenDialogComponent, {
      data: {
        kontoID: this.kontoID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.isLoading = true;
      this.loadKontostand();
      this.loadZahlungen();
      this.isLoading = false;

    });
  }

  
}
