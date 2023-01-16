import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {LoginPageComponent} from './components/login-page/login-page.component';
import {RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DecksDetailsPageComponent} from './components/decks-details-page/decks-details-page.component';
import {EffectsModule} from '@ngrx/effects';
import {HttpClientModule} from "@angular/common/http";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {RegisterPageComponent} from './components/register-page/register-page.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HeaderComponent} from './components/header/header.component';
import {userReducer} from './ngrx/user/user.reducer';
import {cardReducer} from './ngrx/card/card.reducer';
import {UserEffects} from './ngrx/user/user.effect';
import { isDevMode, NgModule} from '@angular/core';
import {InventoryPageComponent} from './components/inventory-page/inventory-page.component';
import {DecksPageComponent} from './components/decks-page/decks-page.component';
import {WishlistPageComponent} from './components/wishlist-page/wishlist-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import {CardComponent} from './components/card/card/card.component';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatInputModule} from '@angular/material/input';
import {HomePageComponent} from "./components/home-page/home-page.component";
import { AddCardComponent } from './components/card/add-card-component/add-card-component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CardEffects } from './ngrx/card/card.effect';
import { InventoryEffects } from './ngrx/inventory/inventory.effect';
import { inventoryReducer } from './ngrx/inventory/inventory.reducer';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CardFooterComponent } from './components/card-footer/card-footer.component';

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
    DecksDetailsPageComponent,
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
    ScrollingModule,
    StoreModule.forRoot({
      user: userReducer,
      card: cardReducer,
      inventory: inventoryReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
