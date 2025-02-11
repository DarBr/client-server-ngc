import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-verkaufen-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, CommonModule],
  templateUrl: './verkaufen-dialog.component.html',
  styleUrl: './verkaufen-dialog.component.css'
})
export class VerkaufenDialogComponent {

  private apiUrl = environment.apiPath;

  isin: string = '';
  vorhandeneAnzahl: number = 0;
  verkaufAnzahl: number = 0;
  depotID: number = 0;
  rueckgabe: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
   

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, public dialogRef: MatDialogRef<VerkaufenDialogComponent>) { }

  ngOnInit() {
    this.depotID = this.data.depotID;
    this.isin = this.data.isin;
    this.vorhandeneAnzahl = this.data.vorhandeneAnzahl;
  }

  verkaufen(sellQuantity: number) {
  this.isLoading = true;
  if (sellQuantity !== null)
    if (!isNaN(sellQuantity) && sellQuantity > 0 && sellQuantity <= this.vorhandeneAnzahl) {
      this.errorMessage = '';
      const url = `${this.apiUrl}/depot/verkaufen?depotID=${this.depotID}&isin=${this.isin}&anzahl=${sellQuantity}`;
      this.http.post(url, {}, {responseType: 'text'}).subscribe(response => {
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
