import { Deck } from "src/app/models/deck.model";
import { Inventory } from "src/app/models/inventory.model";

export interface DeckState {
  isLoading: boolean;
  hasError: boolean;
  decks: Deck[];
}
