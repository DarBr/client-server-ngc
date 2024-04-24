import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) { };

  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  public deleteToken(): void {
    localStorage.removeItem('token');
  }

  
  public async getUsernameFromToken(storedtoken: string): Promise<string | null> {
    const url = 'http://localhost:8080/nutzer/usernamefromtoken';
    const params = {
        token: storedtoken
    };
    const response = await this.http.get(url, {params, responseType: 'text'}).toPromise();
    if (response === "Kein Username gefunden") {
        return null;
    } else {
        return response as string;
    }
  }

  public async getUserIDFromToken(storedtoken: string): Promise<number | null> {
    const url = 'http://localhost:8080/nutzer/useridfromtoken';
    const params = {
        token: storedtoken
    };
    const response = await this.http.get(url, {params}).toPromise();
    if (response === 0) {
        return null;
    } else {
        return response as number;
    }
  }

  public async getDepotIDFromToken(storedtoken: string): Promise<number | null> {
    const url = 'http://localhost:8080/nutzer/depotidfromtoken';
    const params = {
        token: storedtoken
    };
    const response = await this.http.get(url, {params}).toPromise();
    if (response === 0) {
        return null;
    } else {
        return response as number;
    }
  }

  public async getKontoIDFromToken(storedtoken: string): Promise<number | null> {
    const url = 'http://localhost:8080/nutzer/kontoidfromtoken';
    const params = {
        token: storedtoken
    };
    const response = await this.http.get(url, {params}).toPromise();
    if (response === 0) {
        return null;
    } else {
        return response as number;
    }
  }
  
  public async validateToken(storedtoken: string): Promise<boolean | null> {
    const url = 'http://localhost:8080/nutzer/validateToken';
    const params = {
        tokenuebergeben: storedtoken
    };
    const response = await this.http.get(url, {params}).toPromise();
    if (response === true) {
      return true;
    } else {
      this.deleteToken();
      return false;  
    }
  }
  
}