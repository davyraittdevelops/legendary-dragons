import { createAction, props } from '@ngrx/store';
import {WishlistAlert, WishlistAlertRequest, WishlistItem} from "../../models/wishlist.model";

export const getWishlist = createAction(
  '[Wishlist Component] Get Wishlist'
);

export const getWishlistFail = createAction(
  '[Wishlist Component] Get Wishlist Fail',
  props<{ error: boolean }>(),
);

export const getWishlistSuccess = createAction(
  '[Wishlist Component] Get Wishlist Success',
  props<{wishlist_items: WishlistItem[]}>(),
);

export const getAlerts = createAction(
  '[Alerts Component] Get Alerts',
  props<{ wishlist_item_id: string }>(),
);

export const getAlertsFail = createAction(
  '[Alerts Component] Get Alerts Fail',
  props<{ error: boolean }>(),
);

export const getAlertsSuccess = createAction(
  '[Alerts Component] Get Alerts Success',
  props<{alert_items: WishlistAlert[]}>(),
);

export const createWishlistItem = createAction(
  '[Add Wishlist Item Component] Create Wistlist Item',
  props<{ wishlist_item: WishlistItem }>()
);

export const createWishlistItemFail = createAction(
  '[Add Wishlist Item Component] Create Wistlist Item Fail',
  props<{ error: boolean }>(),
);

export const createWishlistItemSuccess = createAction(
  '[Add Wishlist Item Component] Create Wistlist Item Success',
  props<{ wishlist_item: WishlistItem}>()
);

export const createAlert = createAction(
  '[Add Alert Component] Create Alert Item',
  props<{ alert_item: WishlistAlertRequest , wishlist_item_id: string}>()
);

export const createAlertFail = createAction(
  '[Add Alert Component] Create Alert Item Fail',
  props<{ error: boolean }>(),
);

export const createAlertSuccess = createAction(
  '[Add Alert Component] Create Alert Item Success',
  props<{ alert_item: WishlistAlert}>()
);

export const removeAlert = createAction(
  '[Remove Alert] Remove Alert Item',
  props<{ alert_item: WishlistAlertRequest , wishlist_item_id: string}>()
);

export const removeAlertFail = createAction(
  '[Remove Alert] Remove Alert Item Fail',
  props<{ error: boolean }>(),
);

export const removeAlertSuccess = createAction(
  '[Remove Alert ] Remove Alert Item Success',
  props<{ alert_item: WishlistAlert}>()
);

export const removeWishlistItem = createAction(
  '[Remove Wishlist Item Component] Remove Wistlist Item',
  props<{ wishlist_item_id: string }>()
);

export const removeWishlistItemFail = createAction(
  '[Remove Wishlist Item Component] Remove Wistlist Item Fail',
  props<{ error: boolean }>(),
);

export const removeWishlistItemSuccess = createAction(
  '[Remove Wishlist Item Component] Remove Wistlist Item Success',
  props<{ wishlist_item_id: string}>()
);
