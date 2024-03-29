import { createReducer, on } from "@ngrx/store";
import {
  getWishlist,
  getWishlistFail,
  getWishlistSuccess,
  createWishlistItem,
  createWishlistItemSuccess,
  createWishlistItemFail,
  removeWishlistItem,
  removeWishlistItemFail,
  removeWishlistItemSuccess,
  createAlert,
  createAlertSuccess,
  createAlertFail, getAlerts, getAlertsSuccess, getAlertsFail, removeAlert, removeAlertSuccess, removeAlertFail
} from "./wishlist.actions";
import { WishlistState } from "./models/wishlist-state.model";

const initialState: WishlistState = {
  isLoading: false,
  hasError: false,
  wishlist_items: [],
  alert_items: []
}

export const wishlistReducer = createReducer(
  initialState,
  on(getWishlist, (state) => ({...state, isLoading: true})),
  on(getWishlistSuccess, (state, {wishlist_items}) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      wishlist_items: wishlist_items
    };
  }),
  on(getWishlistFail, (state) => ({...state, isLoading: false, hasError: true})),

  on(getAlerts, (state, {wishlist_item_id}) => ({...state, isLoading: true})),
  on(getAlertsSuccess, (state, {alert_items}) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      alert_items: alert_items
    };
  }),
  on(getAlertsFail, (state) => ({...state, isLoading: false, hasError: true})),

  on(createWishlistItem, (state, {wishlist_item}) => ({...state, isLoading: true})),
  on(createWishlistItemSuccess, (state, {wishlist_item}) => {
    const foundIndex = state.wishlist_items.findIndex((item) => item.wishlist_item_id === wishlist_item.wishlist_item_id);
    if (foundIndex > -1)
      return {...state, isLoading: false, hasError: false};
    const wishlist_items_list = [...state.wishlist_items, wishlist_item];
    return {...state, isLoading: false, hasError: false, wishlist_items: wishlist_items_list};
  }),
  on(createWishlistItemFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(removeWishlistItem, (state, {wishlist_item_id}) => ({...state, isLoading: true})),
  on(removeWishlistItemSuccess, (state, { wishlist_item_id }) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      wishlist_items: state.wishlist_items.filter(wishlist_item => wishlist_item.wishlist_item_id !== wishlist_item_id)
    };
  }),
  on(removeWishlistItemFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(createAlert, (state, {alert_item, wishlist_item_id}) => ({...state, isLoading: true})),
  on(createAlertSuccess, (state, {alert_item}) => {
    const foundIndex = state.alert_items.findIndex((item) => item.entity_type === alert_item.entity_type);
    if (foundIndex !== -1) {
        const updated_items_list = [...state.alert_items];
        updated_items_list.splice(foundIndex, 1, alert_item);
        return {...state, isLoading: false, hasError: false, alert_items: updated_items_list};
    } 
     
    return {...state, isLoading: false, hasError: false, alert_items: [...state.alert_items, alert_item]};
  }),
  on(createAlertFail, (state) => ({...state, isLoading: false, hasError: true})),

  on(removeAlert, (state, {wishlist_item_id}) => ({...state, isLoading: true})),
  on(removeAlertSuccess, (state, { alert_item }) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      alert_items: state.alert_items.filter(item => item.entity_type !== alert_item.entity_type)
    };
  }),
  on(removeAlertFail, (state) => ({...state, isLoading: false, hasError: true})),
)
