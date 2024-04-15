import { CommonModule } from '@angular/common'; // Für allgemeine Direktiven wie ngIf, ngFor
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-nutzer-liste',
  templateUrl: './nutzer-liste.component.html',
  styleUrls: ['./nutzer-liste.component.css'],
  standalone: true, // Dies kennzeichnet die Komponente als standalone
  imports: [CommonModule] // Hier fügst du benötigte Module hinzu
})
export class NutzerListeComponent implements OnInit {
  nutzer: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/nutzer').subscribe((data) => {
      this.nutzer = data; // Speichern Sie die Daten in der nutzer-Eigenschaft
      this.isLoading = false;
    });
  }
}
