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
    isLoading = false;
    initalLoading = true;
    stockSymbol: string = ''; 

    constructor(private http: HttpClient) { }

    

    searchNews() {
      // News für das eingegebene Aktiensymbol abrufen
      this.getNews(this.stockSymbol);
    }

    

    getNews(symbol: string) {
      this.isLoading = true;
      this.initalLoading = false;
      const currentDate = this.getCurrentDate(); // Fix: Call the getCurrentDate() function directly
      this.http.get<any[]>(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2022-01-01&to=${currentDate}&token=co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g`).subscribe((data) => { // Fix: Use the currentDate variable in the URL
        this.news = data.map(item => ({
          ...item,
          datetime: this.unixTimeToDateTime(item.datetime)
        }));
        this.isLoading = false;
        this.initalLoading = false;
      });
    }

    getCurrentDate(): string {
      const date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Monate beginnen bei 0 in JavaScript
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
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
