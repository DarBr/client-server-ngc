import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-einzahlen-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './einzahlen-dialog.component.html',
  styleUrl: './einzahlen-dialog.component.css'
})
export class EinzahlenDialogComponent {

  rueckgabe: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  kontoID: number = this.data.kontoID;
  betrag: number = 0;
   

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, public dialogRef: MatDialogRef<EinzahlenDialogComponent>) { }

  ngOnInit() {
    
  }

  einzahlen(betrag: number) {
  this.isLoading = true;
  if (betrag !== null)
    if (!isNaN(betrag) && betrag > 0) {
      this.errorMessage = '';
      const url = `http://localhost:8080/konto/einzahlen?kontoID=${this.kontoID}&betrag=${betrag}`;
      http://localhost:8080/konto/einzahlen?depotID=702&betrag=12
      this.http.put(url, {}, {responseType: 'text'}).subscribe(response => {
        if (response === 'Aktie erfolgreich verkauft!') {
          this.rueckgabe = response;
          this.isLoading = false;
          this.dialogRef.close(this.rueckgabe);
        } else {
          this.rueckgabe = response;
          this.isLoading = false;
          this.dialogRef.close(this.rueckgabe);
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Bitte geben Sie eine gültige Anzahl ein!';
    }
  }
}



