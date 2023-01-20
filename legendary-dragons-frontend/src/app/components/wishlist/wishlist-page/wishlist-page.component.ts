import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Inventory } from 'src/app/models/inventory.model';
import { getInventory } from 'src/app/ngrx/inventory/inventory.actions';
import { errorSelector, inventorySelector, isLoadingSelector } from 'src/app/ngrx/inventory/inventory.selectors';
import {Wishlist} from "../../../models/wishlist.model";
import {wishlistSelector} from "../../../ngrx/wishlist/wishlist.selectors";
import {getWishlist} from "../../../ngrx/wishlist/wishlist.actions";

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  styleUrls: ['./wishlist-page.component.scss']
})
export class WishlistPageComponent implements OnInit {
  wishlist: Observable<Wishlist>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  constructor(private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.wishlist = this.appStore.select(wishlistSelector);
  }

  ngOnInit(): void {
    this.appStore.dispatch(getWishlist())
  }

}
