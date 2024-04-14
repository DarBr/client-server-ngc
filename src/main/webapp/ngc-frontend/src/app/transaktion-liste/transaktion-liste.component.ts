import { Component, OnInit } from '@angular/core';
import { TransaktionService } from '../../transaktion.service'; // Pfad anpassen, falls nötig
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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/transaktionen').subscribe((data) => {
      this.transaktionen = data; // Speichern Sie die Daten in der nutzer-Eigenschaft
      this.isLoading = false;
    });
  }
}


