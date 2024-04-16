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
  formSubmitted = false;

  constructor(private http: HttpClient) { }









  onSubmit() {
    this.formSubmitted = true;
    const url = 'http://localhost:8080/nutzer/add';
    const params = {
      username: this.username,
      password: this.password
    };


    this.http.post(url, params).subscribe(response => {
      if (response === null) {
        this.errorMessage = 'Der Benutzername ist bereits vergeben.';
      } else {
        // Fahren Sie mit der Verarbeitung der Antwort fort
      }
    });

  }
}