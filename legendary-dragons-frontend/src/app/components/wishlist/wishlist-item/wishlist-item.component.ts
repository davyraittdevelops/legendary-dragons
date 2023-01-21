import {Component, Input} from '@angular/core';
import {InventoryCard} from "../../../models/inventory.model";
import {WishlistAlert, WishlistItem} from "../../../models/wishlist.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {getInventory} from "../../../ngrx/inventory/inventory.actions";
import {createAlert, createWishlistItem, removeWishlistItem} from "../../../ngrx/wishlist/wishlist.actions";

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishlistItemComponent {
  @Input() wishlist_item!: WishlistItem;
  pricePoint: any;
  alertType: any;

  constructor(private appStore: Store<AppState>, public modalService: NgbModal) {
  }

  open({content}: { content: any }) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  ngOnInit(): void {
  }

  removeWishlistItem(wishlist_item: WishlistItem) {
    console.log('removing item ' , wishlist_item)
    this.appStore.dispatch(removeWishlistItem({wishlist_item_id: wishlist_item.wishlist_item_id}))
  }

  addAlert(wishlist_item: WishlistItem) {
    console.log('Adding '+ this.alertType + 'alert for price point: ' + this.pricePoint);
    console.log('For this item: ' , wishlist_item)

    const alert_item_obj = {
      card_market_id: this.wishlist_item.card_market_id,
      price_point : this.pricePoint,
      entity_type: this.alertType,
      alert_id: ''
    }

    console.log('sending obj', alert_item_obj)

    this.appStore.dispatch(createAlert({alert_item: alert_item_obj, wishlist_item_id: wishlist_item.wishlist_item_id}))
  }
}
