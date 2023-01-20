import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Inventory } from 'src/app/models/inventory.model';
import { getInventory } from 'src/app/ngrx/inventory/inventory.actions';
import { errorSelector, inventorySelector, isLoadingSelector } from 'src/app/ngrx/inventory/inventory.selectors';
import {getWishlist} from "../../../ngrx/wishlist/wishlist.actions";
import {wishlistItemsSelector} from "../../../ngrx/wishlist/wishlist.selectors";
import {WishlistItem} from "../../../models/wishlist.model";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  styleUrls: ['./wishlist-page.component.scss']
})
export class WishlistPageComponent implements OnInit {
  wishlist_items$: Observable<WishlistItem[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  constructor(private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.wishlist_items$ = this.appStore.select(wishlistItemsSelector);
  }

  ngOnInit(): void {
    this.appStore.dispatch(getWishlist())
  }

}
