import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-kaufen-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, CommonModule],
  templateUrl: './kaufen-dialog.component.html',
  styleUrl: './kaufen-dialog.component.css'
})
export class KaufenDialogComponent {

  symbol: string = '';
  kaufAnzahl: number = 0;
  depotID: number = 0;
  rueckgabe: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
   

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, public dialogRef: MatDialogRef<KaufenDialogComponent>) { }

  ngOnInit() {
    this.depotID = this.data.depotID;
    this.symbol = this.data.symbol;
    
  }

  kaufen(buyQuantity: number) {
    this.isLoading = true;
    if (buyQuantity !== null && !isNaN(buyQuantity) && buyQuantity > 0) {
      this.errorMessage = '';
      const url = `http://localhost:8080/depot/kaufen?depotID=${this.depotID}&isin=${this.symbol}&anzahl=${buyQuantity}`;
      this.http.post(url, {}, {responseType: 'text'}).subscribe(
        (response: string) => {
          if (response === 'Aktie erfolgreich gekauft!') {
            this.rueckgabe = response;
            this.isLoading = false;
            this.dialogRef.close(this.rueckgabe);
          } else {
            this.rueckgabe = response;
            this.isLoading = false;
            this.errorMessage = "Fehler beim Kauf der Aktie!";
            this.dialogRef.close(this.rueckgabe);
          }
        },
        (error: any) => {
          // Hier wird der Fehler abgefangen und entsprechend behandelt
          if (error.status === 404) {
            // Wenn der Fehler 404 ist, bedeutet das, dass das Depot nicht gefunden wurde oder die ISIN ungültig ist
            this.errorMessage = "Kontostand nicht ausreichend.";
          } else {
            // Ansonsten handelt es sich um einen unerwarteten Fehler, der angezeigt wird
            this.errorMessage = "Unerwarteter Fehler beim Kauf der Aktie.";
          }
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
      this.errorMessage = 'Bitte geben Sie eine gültige Anzahl ein!';
    }
  }
  
}

