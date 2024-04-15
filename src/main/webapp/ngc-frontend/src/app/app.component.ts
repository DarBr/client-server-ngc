import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NutzerListeComponent } from './nutzer-liste/nutzer-liste.component';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NutzerListeComponent, TransaktionListeComponent, HttpClientModule, CommonModule, FormsModule]
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

export class DataService {
  constructor(private http: HttpClient) { }

  getNutzerData() {
    return this.http.get<any[]>('http://localhost:8080/nutzer')

  }
}



