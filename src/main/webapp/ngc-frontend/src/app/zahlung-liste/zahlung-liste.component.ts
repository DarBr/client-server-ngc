import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zahlung-liste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zahlung-liste.component.html',
  styleUrl: './zahlung-liste.component.css'
})
export class ZahlungListeComponent implements OnInit {
  zahlungen: any[] = []; // Hier wird das Array initialisiert
  isLoading = true;
  sortColumn: string = '';
  sortAscending: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadTransactions(); // Lade die Transaktionen beim Initialisieren der Komponente
  }

  // Lade die Transaktionen
  loadTransactions() {
    this.http.get<any[]>('http://localhost:8080/zahlungen').subscribe((data) => {
      this.zahlungen = data; // Speichern Sie die Daten in der nutzer-Eigenschaft
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

  
}