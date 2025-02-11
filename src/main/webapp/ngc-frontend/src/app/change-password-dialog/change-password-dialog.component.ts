import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.css'
})
export class ChangePasswordDialogComponent {

  private apiUrl = environment.apiPath;

  isLoading: boolean = false;
  oldPassword: string = '';
  newPassword1: string = '';
  newPassword2: string = '';
  errorMessage: string = '';
  username: string = this.data.username;
  


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, public dialogRef: MatDialogRef<ChangePasswordDialogComponent>) { }

  changePassword(){
    if (this.newPassword1 === '' || this.newPassword2 === '' || this.oldPassword === '') {
      this.errorMessage = 'Bitte füllen Sie alle Felder aus!';
      return;
    }
    if (this.newPassword1 !== this.newPassword2) {
      this.errorMessage = 'Die neuen Passwörter stimmen nicht überein!';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.oldPassword)
      .set('newPassword', this.newPassword1);
    
    const url = `${this.apiUrl}/nutzer/changePassword`;
    this.http.post(url, params, {responseType: 'text'}).subscribe(response => {
      if (response === 'Passwort erfolgreich geändert') {
        this.isLoading = false;
        this.dialogRef.close(response);
      } else {
        this.isLoading = false;
        this.errorMessage = response;
      }
    });

  }


}
