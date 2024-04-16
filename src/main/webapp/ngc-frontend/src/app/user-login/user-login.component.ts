import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

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
  userSaved: boolean = false;

  constructor(private http: HttpClient) { }

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.userSaved = false;
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
        this.userSaved = true;
        this.username = '';
        this.password = '';
      }
    });

  }
}