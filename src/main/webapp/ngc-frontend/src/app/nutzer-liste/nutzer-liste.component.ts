import { CommonModule } from '@angular/common'; // Für allgemeine Direktiven wie ngIf, ngFor
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../app.component';


@Component({
  selector: 'app-nutzer-liste',
  templateUrl: './nutzer-liste.component.html',
  styleUrls: ['./nutzer-liste.component.css'],
  standalone: true, // Dies kennzeichnet die Komponente als standalone
  imports: [CommonModule, RouterModule] // Hier fügst du benötigte Module hinzu
})
export class NutzerListeComponent implements OnInit {
  nutzer: any[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe({
      next: (event: NavigationEnd) => {
        console.log('Navigation Event:', event);
        if (event.urlAfterRedirects.includes('/nutzer-liste')) {
          this.loadData();
        }
      },
      error: (err) => {
        console.error('Fehler beim Abonnieren von Router-Events', err);
      }
    });
  }

  loadData() {
    console.log('Lade Nutzerdaten...');
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8080/nutzer').subscribe({
      next: (data) => {
        console.log('Daten empfangen:', data);
        this.nutzer = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Erzwingt die Aktualisierung der Ansicht
      },
      error: (error) => {
        console.error('Fehler beim Laden der Nutzer', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Erzwingt die Aktualisierung der Ansicht
      }
    });
  }
}
