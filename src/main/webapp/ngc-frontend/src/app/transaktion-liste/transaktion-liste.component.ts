import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaktion-liste',
  templateUrl: './transaktion-liste.component.html',
  styleUrls: ['./transaktion-liste.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TransaktionListeComponent implements OnInit {
  transaktionen: any[] = []; // Hier wird das Array initialisiert
  isLoading = true;
  sortColumn: string = '';
  sortAscending: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadTransactions(); // Lade die Transaktionen beim Initialisieren der Komponente
  }

  // Lade die Transaktionen
  loadTransactions() {
    this.http.get<any[]>('http://localhost:8080/transaktionen').subscribe((data) => {
      this.transaktionen = data; // Speichern Sie die Daten in der nutzer-Eigenschaft
      this.isLoading = false;
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
