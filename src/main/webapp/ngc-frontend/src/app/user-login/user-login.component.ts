import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { ChangeUsernameDialogComponent } from '../change-username-dialog/change-username-dialog.component';

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
  startBudget: number = 0;
  errorMessage: string = '';
  showUsername: string = '';
  formSubmitted: boolean = false;
  successMessage: string = '';
  activeTab: string = 'login';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private appComponent: AppComponent, private dialog: MatDialog) { }

  async ngOnInit() {
    this.appComponent.ngOnInit();
    const token = this.authService.getToken();
    if(token !== null && token !== '') {
      const validation = await this.authService.validateToken(token);
      if (validation === true) {
        this.isLoggedIn = true;
        this.showUsername = (await this.authService.getUsernameFromToken(token)) ?? '';
      }
    }
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.formSubmitted = false;
  }

  onRegister() {
    this.formSubmitted = true;
    if (!this.username || !this.password || this.startBudget<1) {
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    const url = 'http://localhost:8080/nutzer/add';
    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password)
      .set('startBudget', this.startBudget);


    this.http.post(url, params).subscribe(response => {
      if (response === null) {
        this.errorMessage = 'Der Benutzername ist bereits vergeben.';
        
      } else {
        this.successMessage = 'Benutzer wurde erfolgreich angelegt. Sie können sich jetzt einloggen.';
        this.username = '';
        this.password = '';
        this.startBudget = 0;
        this.formSubmitted = false;
      }
    });

  }

  onLogin() {
    this.formSubmitted = true;
    if (!this.username || !this.password) {
      return;
    }
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

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      data: {
        username: this.showUsername
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Passwort erfolgreich geändert') {
        this.authService.deleteToken();
        this.isLoggedIn = false;
        this.ngOnInit();
      }
    });
  }

  openChangeUsernameDialog() {
    const dialogRef = this.dialog.open(ChangeUsernameDialogComponent, {
      data: {
        username: this.showUsername
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Benutzername erfolgreich geändert') {
        this.authService.deleteToken();
        this.isLoggedIn = false;
        this.ngOnInit();
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