import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-newstab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newstab.component.html',
  styleUrl: './newstab.component.css'
})
export class NewstabComponent {


  news: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('https://finnhub.io/api/v1//company-news?symbol=AAPL&from=2023-08-15&to=2023-08-20&token=co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g').subscribe((data) => {
      this.news = data; // Speichern Sie die Daten in der nutzer-Eigenschaft
      this.isLoading = false;
    });
  }

}