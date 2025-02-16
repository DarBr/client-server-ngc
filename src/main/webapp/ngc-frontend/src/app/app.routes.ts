import { Routes } from '@angular/router';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user-login/user-login.component';
import { AuthGuard } from './AuthGuard';
import { AktieKaufenComponent } from './aktie-kaufen/aktie-kaufen.component';
import { VerrechnungskontoComponent } from './verrechnungskonto/verrechnungskonto.component';
import { NewstabComponent } from './newstab/newstab.component';
import { PortfolioHistoryComponent } from './historische-portfolioperformance/portfolio-history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'transaktion-liste', component: TransaktionListeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'kaufen', component: AktieKaufenComponent, canActivate: [AuthGuard]},
  { path: 'verrechnungskonto', component: VerrechnungskontoComponent, canActivate: [AuthGuard]},
  { path: 'news', component: NewstabComponent, canActivate: [AuthGuard]},
  { path: 'portfolio-history', component: PortfolioHistoryComponent, canActivate: [AuthGuard] }
];
