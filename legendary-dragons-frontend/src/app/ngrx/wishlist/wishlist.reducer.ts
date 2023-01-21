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
  createAlertFail
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
    console.log(wishlist_items);
    return {
      ...state,
      isLoading: false,
      hasError: false,
      wishlist_items: wishlist_items
    };
  }),
  on(getWishlistFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(createWishlistItem, (state, {wishlist_item}) => ({...state, isLoading: true})),
  on(createWishlistItemSuccess, (state, {wishlist_item}) => {
    console.log(wishlist_item)
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
    console.log(alert_item)
    const foundIndex = state.alert_items.findIndex((item) => item.alert_id === alert_item.alert_id);
    if (foundIndex > -1)
      return {...state, isLoading: false, hasError: false};
    const alert_items_list = [...state.alert_items, alert_item];
    return {...state, isLoading: false, hasError: false, alert_items: alert_items_list};
  }),
  on(createAlertFail, (state) => ({...state, isLoading: false, hasError: true})),
)
