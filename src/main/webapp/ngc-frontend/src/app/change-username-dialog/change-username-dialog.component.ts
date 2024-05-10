import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-change-username-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './change-username-dialog.component.html',
  styleUrl: './change-username-dialog.component.css'
})
export class ChangeUsernameDialogComponent {
  isLoading: boolean = false;
  newUsername1: string = '';
  newUsername2: string = '';
  errorMessage: string = '';
  username: string = this.data.username;
  


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, public dialogRef: MatDialogRef<ChangeUsernameDialogComponent>) { }

  changeUsername(){
    if (this.newUsername1 === '' || this.newUsername2 === '' || this.username === '') { 
      this.errorMessage = 'Bitte füllen Sie alle Felder aus!';
      return;
    }
    if (this.newUsername1 !== this.newUsername2) {
      this.errorMessage = 'Die neuen Benutzernamen stimmen nicht überein!';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    const params = new HttpParams()
      .set('username', this.username)
      .set('newUsername', this.newUsername1);
    
    const url = 'http://localhost:8080/nutzer/changeUsername';
    this.http.post(url, params, {responseType: 'text'}).subscribe(response => {
      if (response === 'Benutzername erfolgreich geändert') {
        this.isLoading = false;
        this.dialogRef.close(response);
      } else {
        this.isLoading = false;
        this.errorMessage = response;
      }
    });

  }
}
