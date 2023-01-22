import {Component, Input} from '@angular/core';
import {WishlistAlert, WishlistItem} from "../../../models/wishlist.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {
  createAlert,
  getAlerts,
  removeAlert,
  removeWishlistItem
} from "../../../ngrx/wishlist/wishlist.actions";
import {Observable, tap} from "rxjs";
import {errorSelector, isLoadingSelector} from "../../../ngrx/inventory/inventory.selectors";
import {alertItemsSelector} from "../../../ngrx/wishlist/wishlist.selectors";

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
  pricePoint: any = "";
  alertType: any = "";
  isDisabled = false;
  alerts!: WishlistAlert[]
  hasPriceAlert: boolean = false;
  hasAvailabilityAlert: boolean = false;
  hasAddAlertType: boolean = false;
  hasAddAlert: boolean = false;

  constructor(private appStore: Store<AppState>, public modalService: NgbModal) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(errorSelector);
    this.alert_items$ = this.appStore.select(alertItemsSelector).pipe(tap(alerts =>
      this.alerts = alerts
    ));
  }

  open({content}: { content: any }) {
    this.hasPriceAlert = false;
    this.hasAvailabilityAlert = false;
    this.hasAddAlertType = false;
    this.hasAddAlert = false;
    this.pricePoint = "";
    this.alertType = "";

    this.appStore.dispatch(getAlerts({wishlist_item_id: this.wishlist_item.wishlist_item_id}))
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }

  ngOnInit(): void {
  }

  removeWishlistItem(wishlist_item: WishlistItem) {
    this.appStore.dispatch(removeWishlistItem({wishlist_item_id: wishlist_item.wishlist_item_id}))
  }

  changeAlertType(event: any) {
    this.alertType = event.value;
    this.hasAddAlertType = true;
    this.hasAddAlert = false;
    this.pricePoint = "";
  }

  onPriceChange(event: any) {
    this.pricePoint = event.target.value;
    this.hasAddAlert = false;
  }

  addAlert(wishlist_item: WishlistItem) {
    this.hasAddAlert = true;
    if (this.alertType === "") {
      return;
    }

    if (this.alertType === "PRICE" && this.pricePoint === "") {
      return;
    }

    if (this.alerts.length > 0) {
      for (const alert of this.alerts) { 
        if (this.alertType === "AVAILABILITY" && alert.entity_type ==="ALERT#AVAILABILITY") {
          this.hasAvailabilityAlert = true;
          return;
        }
        if (this.alertType === "PRICE" && alert.entity_type ==="ALERT#PRICE") {
          this.hasPriceAlert = true;
          return;
        }
      }
    }

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
    const alertType = alert_item.entity_type.replace('ALERT#', '')
    alert_item_obj.alert_type = alertType
    this.appStore.dispatch(removeAlert({alert_item: alert_item_obj, wishlist_item_id: this.wishlist_item.wishlist_item_id}))

    for (const alert of this.alerts) { 
      if (alert.entity_type !== "ALERT#AVAILABILITY") {
        this.hasAvailabilityAlert = false;
      }
      if (alert.entity_type !== "ALERT#PRICE") {
        this.hasPriceAlert = false;
      }
    }
  }
}
