import {Deck} from "src/app/models/deck.model";

export interface DeckState {
  isLoading: boolean;
  hasError: boolean;
  decks: Deck[];
  selectedDeck: Deck;
}
