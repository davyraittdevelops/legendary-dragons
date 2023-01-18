import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./components/indentity-and-access/login-page/login-page.component";
import {DashboardComponent} from "./components/general/dashboard/dashboard.component";
import {RegisterPageComponent} from "./components/indentity-and-access/register-page/register-page.component";
import {IsLoggedInGuard} from "./guard/is-logged-in.guard";
import {InventoryPageComponent} from "./components/inventory/inventory-page/inventory-page.component";
import {DecksDetailsPageComponent} from "./components/deck/decks-details-page/decks-details-page.component";
import {WishlistPageComponent} from "./components/wishlist/wishlist-page/wishlist-page.component";
import {HomePageComponent} from "./components/general/home-page/home-page.component";
import {DecksPageComponent} from "./components/deck/decks-page/decks-page.component";

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full',
  },
  {
    path: 'home', component: HomePageComponent
  },
  {path: 'login', component: LoginPageComponent},
  {
    path: 'register', component: RegisterPageComponent
  },
  {
    path: 'inventory', component: InventoryPageComponent,
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'decks', component: DecksPageComponent,
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'decks/:id',
    component: DecksDetailsPageComponent
  },
  {
    path: 'wishlist', component: WishlistPageComponent,
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [IsLoggedInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
