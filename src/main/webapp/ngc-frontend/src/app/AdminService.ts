import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  username: string;
  depotID: number;
  portfolioValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/admin'; // Passe die URL bei Bedarf an

  constructor(private http: HttpClient) {}

  // Ruft alle Nutzerdaten für das Dashboard ab
  getDashboardUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/dashboard`);
  }

  // Löscht einen Nutzer anhand der ID
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/nutzer/${userId}`, { responseType: 'text' });
  }
}
