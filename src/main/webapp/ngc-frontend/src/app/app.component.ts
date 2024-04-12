import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NutzerListeComponent } from './nutzer-liste/nutzer-liste.component';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NutzerListeComponent, TransaktionListeComponent, HttpClientModule, CommonModule]
})
export class AppComponent {
  title = 'ngc-frontend';
}
