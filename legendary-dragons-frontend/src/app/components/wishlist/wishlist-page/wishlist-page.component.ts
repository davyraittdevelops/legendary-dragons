import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { WishlistItem } from "../../../models/wishlist.model";
import { getWishlist } from "../../../ngrx/wishlist/wishlist.actions";
import { errorSelector, isLoadingSelector, wishlistItemsSelector } from "../../../ngrx/wishlist/wishlist.selectors";

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
