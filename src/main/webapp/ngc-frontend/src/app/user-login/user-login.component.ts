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
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {

  private apiUrl = environment.apiPath;

  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  username: string = '';
  password: string = '';
  confirmpassword: string = '';
  strength: number = 0;
  showInfo: boolean = false;
  passwordVisible: boolean = false;
  confirmpasswordVisible: boolean = false;
  loginpasswordVisible: boolean = false;
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
    this.username = '';
    this.password = '';
    this.confirmpassword = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.formSubmitted = false;
  }

  onRegister() {
    this.formSubmitted = true;
    this.isLoading = true;
    if(this.strength<2){
      this.isLoading = false;
      this.errorMessage = 'Das Passwort ist zu schwach.';
      return;
    }
    if (this.startBudget<1) {
      this.isLoading = false;
      this.errorMessage = 'Das Startbudget muss mindestens 1 betragen.';
      this.startBudget = 0;
      return;
    }
    if (!this.username || !this.password || !this.confirmpassword || this.startBudget<1) {
      this.isLoading = false;
      this.username = '';
       this.password = '';
       this.confirmpassword = '';
      this.startBudget = 0;
      return;
    }
    if (this.password !== this.confirmpassword) {
      this.isLoading = false;
      this.errorMessage = 'Die Passwörter stimmen nicht überein.';
      this.password = '';
      this.confirmpassword = '';
      this.startBudget = 0;
    }else{
      this.errorMessage = '';
      this.successMessage = '';
      const url = `${this.apiUrl}/nutzer/add`;
      const params = new HttpParams()
        .set('username', this.username)
        .set('password', this.password)
        .set('startBudget', this.startBudget);

      this.http.post(url, params).subscribe(response => {
        if (response === null) {
          this.isLoading = false;
          this.errorMessage = 'Der Benutzername ist bereits vergeben.';
          this.username = '';
          this.password = '';
          this.confirmpassword = '';
          this.startBudget = 0;
        } else {
          this.isLoading = false;
          this.errorMessage = '';
          this.successMessage = 'Benutzer wurde erfolgreich angelegt. Sie können sich jetzt einloggen.';
          this.username = '';
          this.password = '';
          this.confirmpassword = '';
          this.startBudget = 0;
          this.formSubmitted = false;
        }
      });
    }
  }

  onLogin() {
    this.formSubmitted = true;
    if (!this.username || !this.password) {
      return;
    }
    this.isLoading = true;
    const url = `${this.apiUrl}/nutzer/login`;
    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password);

    this.http.get(url, {params, responseType: 'text'}).subscribe(response => {
      if (response ==="Login fehlgeschlagen") {
        this.isLoading = false;
        this.errorMessage = response.toString();
        console.log(response);
      } else {
        this.isLoading = false;
        const token = response.toString();
        this.authService.saveToken(token);
        this.username = '';
        this.password = '';
        this.router.navigate(['/']);
        this.appComponent.ngOnInit();     
      }
    });
  }

  clearError() {
    this.errorMessage = '';
    this.formSubmitted = false;
  }

  passwordStrength(password: string): number {
    let score = 0;
    
    if (!password) return score;
  
    // Länge (mind. 8 Zeichen)
    if (password.length >= 8) score++;
  
    // Enthält Zahlen
    if (/\d/.test(password)) score++;
  
    // Enthält Groß- und Kleinbuchstaben
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  
    // Enthält Sonderzeichen
    if (/[@$!%*?&]/.test(password)) score++;
  
    return score; // Maximal 4 Punkte
  }

  getStrengthLabel(strength: number): string {
    switch (strength) {
      case 1: return "Schwach";
      case 2: return "Mittel";
      case 3: return "Stark";
      case 4: return "Sehr stark";
      default: return "Sehr schwach";
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmpasswordVisible = !this.confirmpasswordVisible;
  }

  toggleloginPasswordVisibility() {
    this.loginpasswordVisible = !this.loginpasswordVisible;
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