import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectWishlist = (state: AppState) => state.wishlist

export const isLoadingSelector = createSelector(selectWishlist, (state) => state.isLoading);
export const errorSelector = createSelector(selectWishlist, (state) => state.hasError);
export const wishlistSelector = createSelector(selectWishlist, (state) => state.wishlist);
