import { Routes } from '@angular/router';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HomeComponent } from './home/home.component';
import { NutzerListeComponent } from './nutzer-liste/nutzer-liste.component';
import { LoginComponent } from './user-login/user-login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'nutzer-liste', component: NutzerListeComponent },
  { path: 'transaktion-liste', component: TransaktionListeComponent },
 { path: 'login', component: LoginComponent  }
];
