import { Deck } from "src/app/models/deck.model";

export interface DeckState {
  isLoading: boolean;
  isAddCardLoading: boolean;
  hasError: boolean;
  decks: Deck[];
  selectedDeck: Deck;
}
