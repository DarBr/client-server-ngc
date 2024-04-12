import { Component, OnInit } from '@angular/core';
import { TransaktionService } from '../../transaktion.service'; // Pfad anpassen, falls nötig

@Component({
  selector: 'app-transaktion-liste',
  templateUrl: './transaktion-liste.component.html',
  styleUrls: ['./transaktion-liste.component.css']
})
export class TransaktionListeComponent implements OnInit {
  transaktionen: any[] = []; // Hier wird das Array initialisiert

  constructor(private transaktionService: TransaktionService) { }

  ngOnInit() {
    this.transaktionService.getTransaktionenList().subscribe(
      data => {
        this.transaktionen = data;
      },
      error => {
        console.error('Es gab ein Problem beim Abrufen der Transaktionen:', error);
      }
    );
  }
}


