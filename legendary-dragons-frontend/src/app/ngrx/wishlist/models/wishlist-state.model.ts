import {WishlistAlert, WishlistItem} from "../../../models/wishlist.model";

export interface WishlistState {
  isLoading: boolean;
  hasError: boolean;
  wishlist_items: WishlistItem[];
  alert_items: WishlistAlert[];
}
