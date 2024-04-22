import { Routes } from '@angular/router';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HomeComponent } from './home/home.component';
import { NutzerListeComponent } from './nutzer-liste/nutzer-liste.component';
import { LoginComponent } from './user-login/user-login.component';
import { AuthGuard } from './AuthGuard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'nutzer-liste', component: NutzerListeComponent, canActivate: [AuthGuard]},
  { path: 'transaktion-liste', component: TransaktionListeComponent, canActivate: [AuthGuard]},
 { path: 'login', component: LoginComponent}
];
