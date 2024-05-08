import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-auszahlen-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './auszahlen-dialog.component.html',
  styleUrl: './auszahlen-dialog.component.css'
})
export class AuszahlenDialogComponent {

  rueckgabe: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  kontoID: number = this.data.kontoID;
  betrag: number = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, public dialogRef: MatDialogRef<AuszahlenDialogComponent>) { }

  ngOnInit() {

  }

  auszahlen(betrag: number) {
    this.isLoading = true;
    if (betrag !== null)
      if (!isNaN(betrag) && betrag > 0) {
        this.errorMessage = '';
        const url = `http://localhost:8080/konto/auszahlen?kontoID=${this.kontoID}&betrag=${betrag}`;
  
        // Kontostand abrufen
        const kontostandUrl = `http://localhost:8080/konto/${this.kontoID}`;

        this.http.get<any>(kontostandUrl).subscribe(konto => {
          if (konto.kontostand >= betrag) {
            // Auszahlung durchführen, wenn der Kontostand ausreicht
            this.http.put(url, {}, { responseType: 'text' }).subscribe(response => {
              if (response === 'Einzahlung erfolgreich!') {
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
            this.errorMessage = 'Ihr Kontostand reicht nicht aus, um diese Auszahlung vorzunehmen!';
          }
        });
      } else {
        this.isLoading = false;
        this.errorMessage = 'Bitte geben Sie eine gültige Anzahl ein!';
      }
  }

}
