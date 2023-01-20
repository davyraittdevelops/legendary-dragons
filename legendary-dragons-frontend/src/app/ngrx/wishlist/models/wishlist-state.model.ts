import { Wishlist } from "src/app/models/wishlist.model";

export interface WishlistState {
  isLoading: boolean;
  hasError: boolean;
  wishlist: Wishlist;
}
