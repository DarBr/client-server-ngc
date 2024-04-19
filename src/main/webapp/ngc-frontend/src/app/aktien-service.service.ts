import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AktienService {
  private apiUrl = 'https://api.example.com/aktien'; // Ersetzen Sie dies durch die URL Ihrer API

  constructor(private http: HttpClient) { }

  getAktienWert(isin: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${isin}`);
  }
}