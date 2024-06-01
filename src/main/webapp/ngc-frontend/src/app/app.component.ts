import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './AuthService';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TransaktionListeComponent, HttpClientModule, CommonModule, FormsModule, MatDialogModule]
})
export class AppComponent {
  title = 'ngc-frontend';
  username: string | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const token = this.authService.getToken();
    if (token !== null && token !== '') {
      this.username = await this.authService.getUsernameFromToken(token);
    }else {
      this.username = 'Login';
    }
  }

}



