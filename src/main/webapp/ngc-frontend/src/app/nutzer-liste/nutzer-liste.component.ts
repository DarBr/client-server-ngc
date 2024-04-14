import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-nutzer-liste',
  templateUrl: './nutzer-liste.component.html',
  styleUrls: ['./nutzer-liste.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NutzerListeComponent implements OnInit {
  nutzer: any[] = []; // Erstellen Sie eine Eigenschaft, um die Nutzer zu speichern
  isLoading = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/nutzer').subscribe((data) => {
      this.nutzer = data; // Speichern Sie die Daten in der nutzer-Eigenschaft
      this.isLoading = false;
    });
  }
}
  
  
