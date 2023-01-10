import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RegisterPageComponent} from "./components/register-page/register-page.component";
import {IsLoggedInGuard} from "./guard/is-logged-in.guard";
import {InventoryPageComponent} from "./components/inventory-page/inventory-page.component";
import {DecksPageComponent} from "./components/decks-page/decks-page.component";
import {WishlistPageComponent} from "./components/wishlist-page/wishlist-page.component";
import {LandingPageComponent} from "./components/landing-page/landing-page.component";

const routes: Routes = [
  {
    path: '', redirectTo: '/landing', pathMatch: 'full',
  },
  {
    path: 'landing', component: LandingPageComponent
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
