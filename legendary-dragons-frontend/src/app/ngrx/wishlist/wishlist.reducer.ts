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
  removeWishlistItemSuccess
} from "./wishlist.actions";
import { WishlistState } from "./models/wishlist-state.model";

const initialState: WishlistState = {
  isLoading: false,
  hasError: false,
  wishlist: {
    id: "",
    created_at: new Date(""),
    last_modified: new Date(""),
    wishlist_items: []
  }
}

export const wishlistReducer = createReducer(
  initialState,
  on(getWishlist, (state) => ({...state, isLoading: true})),
  on(getWishlistSuccess, (state, {wishlist}) => ({...state, isLoading: false, hasError: false, wishlist: wishlist})),
  on(getWishlistFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(createWishlistItem, (state, {wishlist_item}) => ({...state, isLoading: true})),
  on(createWishlistItemSuccess, (state, {wishlist_item}) => {
    const foundIndex = state.wishlist.wishlist_items.findIndex((wishlist_item) => wishlist_item.wishlist_item_id === wishlist_item.wishlist_item_id);

    if (foundIndex > -1)
      return {...state, isLoading: false, hasError: false};

    const wishlist_items = [...state.wishlist.wishlist_items, wishlist_item];
    const newWishlist = {...state.wishlist, wishlist_items: wishlist_items};

    return {...state, isLoading: false, hasError: false, wishlist: newWishlist};
  }),
  on(createWishlistItemFail, (state) => ({...state, isLoading: false, hasError: true})),

  on(removeWishlistItem, (state, {wishlist_item_id}) => ({...state, isLoading: true})),
  on(removeWishlistItemSuccess, (state, { wishlist_item }) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,

      wishlist: {
        id: state.wishlist.id,
        created_at: state.wishlist.created_at,
        last_modified: state.wishlist.last_modified,
        wishlist_items: state.wishlist.wishlist_items.filter(wishlist_item => wishlist_item.wishlist_item_id !== wishlist_item.wishlist_item_id)
      }
    };
  }),
  on(removeWishlistItemFail, (state) => ({...state, isLoading: false, hasError: true})),
)
