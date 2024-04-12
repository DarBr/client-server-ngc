// transaktion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransaktionService {
  private baseUrl = 'http://localhost:8080/transaktionen';

  constructor(private http: HttpClient) { }

  getTransaktionenList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}

