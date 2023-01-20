import {Component, Input} from '@angular/core';
import {InventoryCard} from "../../../models/inventory.model";
import {WishlistItem} from "../../../models/wishlist.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {getInventory} from "../../../ngrx/inventory/inventory.actions";

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishlistItemComponent {
  @Input() wishlist_item!: WishlistItem;

  constructor() {
  }

  ngOnInit(): void {
    console.log('item: ' , this.wishlist_item)
  }


}
