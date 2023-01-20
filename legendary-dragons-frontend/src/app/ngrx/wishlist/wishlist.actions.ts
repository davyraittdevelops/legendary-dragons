import { createAction, props } from '@ngrx/store';
import { Wishlist, WishlistItem } from 'src/app/models/wishlist.model';

export const getWishlist = createAction(
  '[Wishlist Component] Get Wishlist'
);

export const getWishlistFail = createAction(
  '[Wishlist Component] Get Wishlist Fail',
  props<{ error: boolean }>(),
);

export const getWishlistSuccess = createAction(
  '[Wishlist Component] Get Wishlist Success',
  props<{wishlist: Wishlist}>(),
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
  props<{ wishlist_item: WishlistItem}>()
);