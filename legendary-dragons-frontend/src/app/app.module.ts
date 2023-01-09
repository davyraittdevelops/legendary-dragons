import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from "@angular/common/http";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { userReducer } from './ngrx/user/user.reducer';
import { UserEffects } from './ngrx/user/user.effect';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    RegisterPageComponent,
    LoginPageComponent,
    DashboardComponent,
    NavbarComponent,
    HeaderComponent
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

    StoreModule.forRoot({
      user: userReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
