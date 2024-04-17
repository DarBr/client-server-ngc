import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-aktie-kaufen',
  standalone: true,
  templateUrl: './aktie-kaufen.component.html',
  styleUrl: './aktie-kaufen.component.css',
  imports: [CommonModule, FormsModule]
})
export class AktieKaufenComponent {
  isin: string = '';
  anzahl: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  depotId: number = 10;
  formSubmitted: boolean = false;
  stockSaved: boolean = false;

  constructor(private http: HttpClient) { }

  kaufen() {
    this.errorMessage = '';
    const url = `http://localhost:8080/depot/kaufen?isin=${this.isin}&anzahl=${this.anzahl}&depotID=${this.depotId}`;
  
    this.http.post(url, {}).subscribe;
    //Error Message oder Success Message einfügen
  }

}
