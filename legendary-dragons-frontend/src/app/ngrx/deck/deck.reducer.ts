import { createReducer, on } from "@ngrx/store";
import {
  createDeck,
  createDeckSuccess,
  createDeckFail

} from "./deck.actions";
import { DeckState } from "./models/deck-state.model";

const initialState: DeckState = {
  isLoading: false,
  hasError: false,
  decks: []
}

export const deckReducer = createReducer(
  initialState,
  on(createDeck, (state, {deck_name, deck_type}) => ({...state, isLoading: true})),
  on(createDeckSuccess, (state, {deck}) => ({...state, isLoading: false, hasError: false, decks: [...state.decks, deck]})),
  on(createDeckFail, (state) => ({...state, isLoading: false, hasError: true})),
)
