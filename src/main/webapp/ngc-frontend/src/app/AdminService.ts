// admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  username: string;
  depotID: number;
  portfolioValue: number;
  kontoID: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Admin-Endpoint im Backend
  private apiUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  // Ruft alle Nutzer fürs Admin-Dashboard ab
  getDashboardUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/dashboard`);
  }

  // Löscht einen Nutzer anhand seiner ID
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/nutzer/${userId}`, { responseType: 'text' });
  }
}
