import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NutzerListeComponent } from './nutzer-liste/nutzer-liste.component';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TransaktionListeComponent, HttpClientModule, CommonModule]
})
export class AppComponent {
  title = 'ngc-frontend';
  nutzer: any[] = [];

  constructor(private http: HttpClient) { }

  callApi() {
    this.http.get<any[]>('http://localhost:8080/nutzer').subscribe((data) => {
      this.nutzer = data; 

      console.log(this.nutzer);
    });
  }
}
