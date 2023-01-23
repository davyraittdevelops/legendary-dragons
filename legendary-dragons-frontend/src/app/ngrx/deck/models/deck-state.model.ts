import { Deck } from "src/app/models/deck.model";

export interface DeckState {
  isLoading: boolean;
  isDeckLoading: boolean;
  hasError: boolean;
  decks: Deck[];
  selectedDeck: Deck;
}
