import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from "@angular/common/http";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { userReducer } from './ngrx/user/user.reducer';
import { UserEffects } from './ngrx/user/user.effect';
import { NgModule } from '@angular/core';
import { InventoryPageComponent } from './components/inventory-page/inventory-page.component';
import {
  DecksDetailsPageComponent
} from './components/decks-details-page/decks-details-page.component';
import { WishlistPageComponent } from './components/wishlist-page/wishlist-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import { AddCardComponent } from './components/card/add-card-button/add-card-component';
import { CardComponent } from './components/card/card/card.component';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    RegisterPageComponent,
    LoginPageComponent,
    DashboardComponent,
    NavbarComponent,
    HeaderComponent,
    InventoryPageComponent,
    DecksDetailsPageComponent,
    WishlistPageComponent,
    AddCardComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    ReactiveFormsModule,
    HttpClientModule,
    EffectsModule.forRoot([
      UserEffects
    ]),
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ScrollingModule,
    StoreModule.forRoot({
      user: userReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
