import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-newstab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newstab.component.html',
  styleUrl: './newstab.component.css'
})
export class NewstabComponent {
  news: any[] = [];
  isLoading = true;
  stockSymbol: string = ''; // Variable für das Aktiensymbol

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Standardmäßig News für 'META' abrufen
    
  }

  searchNews() {
    // News für das eingegebene Aktiensymbol abrufen
    this.getNews(this.stockSymbol);
  }

  getNews(symbol: string) {
    this.isLoading = true;
    this.http.get<any[]>(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2023-08-15&to=2024-08-20&token=co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g`).subscribe((data) => {
      this.news = data.map(item => ({
        ...item,
        datetime: this.unixTimeToDateTime(item.datetime)
      }));
      this.isLoading = false;
    });
  }

  unixTimeToDateTime(unixTime: number): string {
    const date = new Date(unixTime * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return date.toLocaleString('de-DE', options);
  }
}
