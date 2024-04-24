import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  isLoggedIn: boolean = false;
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  formSubmitted: boolean = false;
  successMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private appComponent: AppComponent) { }

  async ngOnInit() {
    this.appComponent.ngOnInit();
    const token = this.authService.getToken();
    if(token !== null && token !== '') {
      const validation = await this.authService.validateToken(token);
      if (validation === true) {
        this.isLoggedIn = true;
      }
    }
  }

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


    this.http.get(url, {params, responseType: 'text'}).subscribe(response => {
      if (response ==="Login fehlgeschlagen") {
        this.errorMessage = response.toString();
        console.log(response);
      } else {
        const token = response.toString();
        this.authService.saveToken(token);
        this.successMessage = 'Erfolgreich eingeloggt.';
        this.username = '';
        this.password = '';
        this.router.navigate(['/']);
        this.appComponent.ngOnInit();     
      }
    });
  }
  
  onLogout() {
    this.authService.deleteToken();
    this.isLoggedIn = false;
    this.appComponent.ngOnInit(); 
    this.router.navigate(['/login']);
  }
}