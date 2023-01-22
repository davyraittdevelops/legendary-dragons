import {Component, Input} from '@angular/core';
import {InventoryCard} from "../../../models/inventory.model";
import {WishlistAlert, WishlistAlertRequest, WishlistItem} from "../../../models/wishlist.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {getInventory} from "../../../ngrx/inventory/inventory.actions";
import {
  createAlert,
  createWishlistItem, getAlerts,
  getWishlist, removeAlert,
  removeWishlistItem
} from "../../../ngrx/wishlist/wishlist.actions";
import {Observable} from "rxjs";
import {errorSelector, isLoadingSelector} from "../../../ngrx/inventory/inventory.selectors";
import {alertItemsSelector, wishlistItemsSelector} from "../../../ngrx/wishlist/wishlist.selectors";

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishlistItemComponent {
  @Input() wishlist_item!: WishlistItem;
  alert_items$: Observable<WishlistAlert[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  pricePoint: any;
  alertType: any;
  isDisabled = false;


  constructor(private appStore: Store<AppState>, public modalService: NgbModal) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.alert_items$ = this.appStore.select(alertItemsSelector);
  }

  open({content}: { content: any }) {
    this.appStore.dispatch(getAlerts({wishlist_item_id: this.wishlist_item.wishlist_item_id}))
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  ngOnInit(): void {
  }

  removeWishlistItem(wishlist_item: WishlistItem) {
    this.appStore.dispatch(removeWishlistItem({wishlist_item_id: wishlist_item.wishlist_item_id}))
  }

  addAlert(wishlist_item: WishlistItem) {
    const alert_item_obj = {
      card_market_id: this.wishlist_item.card_market_id,
      price_point : this.pricePoint,
      alert_type: this.alertType,
      alert_id: ''
    }
    this.appStore.dispatch(createAlert({alert_item: alert_item_obj, wishlist_item_id: wishlist_item.wishlist_item_id}))
  }

  removeAlert(alert_item: WishlistAlert) {
    let alert_item_obj = JSON.parse(JSON.stringify(alert_item))
    console.log(alert_item_obj)
    // alert_item_obj.alert_type =
    this.appStore.dispatch(removeAlert({alert_item: alert_item_obj, wishlist_item_id: this.wishlist_item.wishlist_item_id}))

  }
}
