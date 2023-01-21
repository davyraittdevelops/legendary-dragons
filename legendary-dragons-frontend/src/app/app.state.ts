import { CardState } from "./ngrx/card/models/card-state.model";
import { DeckState } from "./ngrx/deck/models/deck-state.model";
import { InventoryState } from "./ngrx/inventory/models/inventory-state.model";
import { UserState } from "./ngrx/user/models/user-state.model";
import { WishlistState } from "./ngrx/wishlist/models/wishlist-state.model";
import {WishlistAlert} from "./models/wishlist.model";

export interface AppState {
  readonly alert_items: WishlistState
  readonly user: UserState;
  readonly card: CardState;
  readonly inventory: InventoryState;
  readonly deck: DeckState;
  readonly wishlist: WishlistState;
}
