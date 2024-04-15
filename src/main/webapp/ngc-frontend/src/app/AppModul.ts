import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NutzerListeComponent } from './nutzer-liste/nutzer-liste.component';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NutzerListeComponent,
    TransaktionListeComponent
    // füge hier andere Komponenten hinzu, falls nötig
  ],
  imports: [
    BrowserModule,
    HttpClientModule
    // hier können weitere Module importiert werden, wie FormsModule, RouterModule, etc.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
