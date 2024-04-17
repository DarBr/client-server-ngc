import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../AuthService';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  formSubmitted: boolean = false;
  successMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService) { }

  onRegister() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    const url = 'http://localhost:8080/nutzer/add';
    const params = {
      username: this.username,
      password: this.password
    };


    this.http.post(url, params).subscribe(response => {
      if (response === null) {
        this.errorMessage = 'Der Benutzername ist bereits vergeben.';
        
      } else {
        this.successMessage = 'Benutzer wurde erfolgreich angelegt.';
        this.username = '';
        this.password = '';
      }
    });

  }

  onLogin() {
    this.formSubmitted = true;
    const url = 'http://localhost:8080/nutzer/login';
    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password);


    this.http.get(url, {params}).subscribe(response => {
      if (typeof response === 'number') {
        this.successMessage = 'Erfolgreich eingeloggt.';
        this.authService.login();
      } else {
        this.errorMessage = response.toString();
      }
    });
  }  
}