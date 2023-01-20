import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from "@angular/common/http";
import { isDevMode, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from "@angular/router";
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from './app.component';
import { CardFooterComponent } from './components/card/card-footer/card-footer.component';
import { AddCardComponent } from './components/card/add-card-component/add-card-component';
import { AddWishlistItemComponent } from './components/card/add-wishlist-item-component/add-wishlist-item-component';
import { DashboardComponent } from './components/general/dashboard/dashboard.component';
import { AddCardToDeckComponent } from './components/deck/add-card-to-deck/add-card-to-deck.component';
import { DecksDetailsPageComponent } from './components/deck/decks-details-page/decks-details-page.component';
import { DecksPageComponent } from './components/deck/decks-page/decks-page.component';
import { HeaderComponent } from './components/general/header/header.component';
import { HomePageComponent } from "./components/general/home-page/home-page.component";
import { InventoryPageComponent } from './components/inventory/inventory-page/inventory-page.component';
import { LoginPageComponent } from './components/indentity-and-access/login-page/login-page.component';
import { NavbarComponent } from './components/general/navbar/navbar.component';
import { RegisterPageComponent } from './components/indentity-and-access/register-page/register-page.component';
import { WishlistPageComponent } from './components/wishlist/wishlist-page/wishlist-page.component';
import { CardEffects } from './ngrx/card/card.effect';
import { cardReducer } from './ngrx/card/card.reducer';
import { DeckEffects } from './ngrx/deck/deck.effect';
import { deckReducer } from './ngrx/deck/deck.reducer';
import { InventoryEffects } from './ngrx/inventory/inventory.effect';
import { inventoryReducer } from './ngrx/inventory/inventory.reducer';
import { UserEffects } from './ngrx/user/user.effect';
import { userReducer } from './ngrx/user/user.reducer';
import { DeckCardsDetailsPageComponent } from './components/deck/deck-cards-details/deck-cards-details-page.component';
import { CardsDetailsPageComponent } from './components/card/cards-details/cards-details-page.component';
import { wishlistReducer } from './ngrx/wishlist/wishlist.reducer';
import { WishlistEffects } from './ngrx/wishlist/wishlist.effect';

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
    AddWishlistItemComponent,
    CardFooterComponent,
    AddCardToDeckComponent,
    CardsDetailsPageComponent,
    DeckCardsDetailsPageComponent,
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
      InventoryEffects,
      DeckEffects,
      WishlistEffects
    ]),
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgbToastModule,
    ScrollingModule,
    StoreModule.forRoot({
      user: userReducer,
      card: cardReducer,
      inventory: inventoryReducer,
      deck: deckReducer,
      wishlist: wishlistReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
