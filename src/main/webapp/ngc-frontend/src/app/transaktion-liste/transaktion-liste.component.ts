import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../AuthService';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transaktion-liste',
  templateUrl: './transaktion-liste.component.html',
  styleUrls: ['./transaktion-liste.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TransaktionListeComponent implements OnInit {
  userID: number = 0;
  depotID: number = 0;
  transaktionen: any[] = []; // Hier wird das Array initialisiert
  isLoading = true;
  keineTransaktionen = false;
  sortColumn: string = '';
  sortAscending: boolean = true;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.loadUserIDs(() => {
      this.loadTransactions();
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

  // Lade die Transaktionen
  loadTransactions() {
    this.http.get<any[]>(`http://localhost:8080/transaktionen/transaktionenByKontoID/${this.depotID}`).subscribe((data) => {
      this.transaktionen = data.sort((a, b) => new Date(b.zeitstempel).getTime() - new Date(a.zeitstempel).getTime());
      this.isLoading = false;
      if (this.transaktionen.length === 0) {
        this.keineTransaktionen = true;
      }
      if(this.transaktionen.length > 0) {
        this.keineTransaktionen = false;
      };
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

    this.transaktionen.sort((a, b) => {
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
