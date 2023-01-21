import {Component, Input} from '@angular/core';
import {InventoryCard} from "../../../models/inventory.model";
import {WishlistItem} from "../../../models/wishlist.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {getInventory} from "../../../ngrx/inventory/inventory.actions";
import {createWishlistItem, removeWishlistItem} from "../../../ngrx/wishlist/wishlist.actions";

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishlistItemComponent {
  @Input() wishlist_item!: WishlistItem;

  constructor(private appStore: Store<AppState>) {
  }

  ngOnInit(): void {
  }

  removeWishlistItem(wishlist_item: WishlistItem) {
    console.log('removing item ' , wishlist_item)
    this.appStore.dispatch(removeWishlistItem({wishlist_item_id: wishlist_item.wishlist_item_id}))

  }
}
