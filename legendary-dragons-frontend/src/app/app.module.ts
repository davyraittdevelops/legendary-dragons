import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from "@angular/common/http";
import { isDevMode, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from "@angular/router";
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from './app.component';
import { CardFooterComponent } from './components/card-footer/card-footer.component';
import { AddCardComponent } from './components/card/add-card-component/add-card-component';
import { CardComponent } from './components/card/card/card.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DecksPageComponent } from './components/decks-page/decks-page.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { InventoryPageComponent } from './components/inventory-page/inventory-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { WishlistPageComponent } from './components/wishlist-page/wishlist-page.component';
import { CardEffects } from './ngrx/card/card.effect';
import { cardReducer } from './ngrx/card/card.reducer';
import { InventoryEffects } from './ngrx/inventory/inventory.effect';
import { inventoryReducer } from './ngrx/inventory/inventory.reducer';
import { UserEffects } from './ngrx/user/user.effect';
import { userReducer } from './ngrx/user/user.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    DashboardComponent,
    NavbarComponent,
    HeaderComponent,
    InventoryPageComponent,
    DecksPageComponent,
    WishlistPageComponent,
    AddCardComponent,
    CardComponent,
    CardFooterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    EffectsModule.forRoot([
      UserEffects,
      CardEffects,
      InventoryEffects
    ]),
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgbToastModule,
    StoreModule.forRoot({
        user: userReducer,
        card: cardReducer,
        inventory: inventoryReducer
      },
      ),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
