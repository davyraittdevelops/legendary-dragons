import { Component, Input } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Observable, tap } from "rxjs";
import { AlertType } from 'src/app/models/alert-type.enum';
import { AppState } from "../../../app.state";
import { WishlistAlert, WishlistItem } from "../../../models/wishlist.model";
import {
    createAlert, getAlerts, removeAlert,
    removeWishlistItem
} from "../../../ngrx/wishlist/wishlist.actions";
import { alertItemsSelector, errorSelector, isLoadingSelector } from "../../../ngrx/wishlist/wishlist.selectors";

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
  alertTypeEnum = AlertType;
  pricePoint: string = '';
  alertType: any;
  hasAvailabilityAlert: boolean = false;

  constructor(private appStore: Store<AppState>, public modalService: NgbModal) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.alert_items$ = this.appStore.select(alertItemsSelector).pipe(
      tap((alerts) => {
        // Run this in next JS cycle
        setTimeout(() => {
          this.hasAvailabilityAlert = alerts.some(alert => alert.entity_type ===  `ALERT#${AlertType.AVAILABILITY}`)
        }, 0);

      })
    );
  }

  open({content}: { content: any }) {
    this.appStore.dispatch(getAlerts({wishlist_item_id: this.wishlist_item.wishlist_item_id}))
    // TODO: dispatch clearAlerts after closing the modal service to fix setTimeout
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  ngOnInit(): void {
  }

  removeWishlistItem(wishlist_item: WishlistItem) {
    this.appStore.dispatch(removeWishlistItem({wishlist_item_id: wishlist_item.wishlist_item_id}))
  }

  addAlert(wishlist_item: WishlistItem) {
    if (this.isInvalidPricePoint) {
      return;
    }

    const alert_item_obj = {
      card_market_id: this.wishlist_item.card_market_id,
      price_point : this.pricePoint.trim(),
      alert_type: this.alertType,
      alert_id: ''
    }

    this.appStore.dispatch(createAlert({alert_item: alert_item_obj, wishlist_item_id: wishlist_item.wishlist_item_id}))

    this.alertType = '';
    this.pricePoint = '';
  }

  removeAlert(alert_item: WishlistAlert) {
    let alert_item_obj = JSON.parse(JSON.stringify(alert_item))
    const alertType = alert_item.entity_type.replace('ALERT#', '')
    alert_item_obj.alert_type = alertType
    this.appStore.dispatch(removeAlert({alert_item: alert_item_obj, wishlist_item_id: this.wishlist_item.wishlist_item_id}))
  }

  get isInvalidPricePoint(): boolean {
    return this.alertType === AlertType.PRICE && (isNaN(+this.pricePoint) || this.pricePoint.trim() === '');
  }
}
