import { createReducer, on } from "@ngrx/store";
import {
  createDeck,
  createDeckSuccess,
  createDeckFail,
  removeDeck,
  removeDeckSuccess,
  removeDeckFail,
  getDecks,
  getDecksSuccess,
  getDecksFail,
  getCardsFromDeck,
  getCardsFromDeckFail,
  getCardsFromDeckSuccess,
  addCardToDeck,
  addCardToDeckFail,
  addCardToDeckSuccess,
  removeCardFromDeck,
  removeCardFromDeckFail,
  removeCardFromDeckSuccess
} from "./deck.actions";
import { DeckState } from "./models/deck-state.model";

const initialState: DeckState = {
  isLoading: false,
  hasError: false,
  decks: [],
  selectedDeck: {
    deck_id: "",
    deck_name: "",
    deck_type: "",
    total_value: "",
    created_at: new Date(""),
    last_modified: new Date(""),
    image_url: "",
    deck_cards: [],
    side_deck_cards: []
  }
}

export const deckReducer = createReducer(
  initialState,
  on(createDeck, (state, {deck_name, deck_type}) => ({...state, isLoading: true})),
  on(createDeckSuccess, (state, {deck}) => ({...state, isLoading: false, hasError: false, decks: [...state.decks, deck]})),
  on(createDeckFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(removeDeck, (state, {deck_id}) => ({...state, isLoading: true})),
  on(removeDeckSuccess, (state, {deck}) => ({
    ...state,
    isLoading: false,
    hasError: false,
    decks: state.decks.filter(currentDeck => currentDeck.deck_id !== deck.deck_id)

  })),
  on(removeDeckFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getDecks, (state) => ({...state, isLoading: true})),
  on(getDecksFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getDecksSuccess, (state, {decks}) => ({...state, isLoading: false, hasError: false, decks: decks})),
  on(getCardsFromDeck, (state, {deck_id}) => ({...state, isLoading: true})),
  on(getCardsFromDeckFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getCardsFromDeckSuccess, (state, {deck_id, main_deck_cards, side_deck_cards}) => {
    let foundDeck = state.decks.find(d => d.deck_id === deck_id)
    let updatedDeck = {...foundDeck!, deck_cards: main_deck_cards, side_deck_cards: side_deck_cards};

    return {
      ...state,
      selectedDeck: updatedDeck
    };
  }),
  on(addCardToDeck, (state, {deck_id, deck_type, inventory_card}) => ({...state, isLoading: true})),
  on(addCardToDeckSuccess, (state, {deck}) => {
    let foundDeck = state.decks.find(d => d.deck_id === deck.deck_id)
    let updatedDeck = {...foundDeck!, deck_cards: deck.deck_cards};

    return {
      ...state,
      selectedDeck: updatedDeck
    };

  }),
  on(addCardToDeckFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(removeCardFromDeck, (state, {deck_id, inventory_card}) => ({...state, isLoading: true})),
  on(removeCardFromDeckSuccess, (state, {deck_id, deck_card}) => {
    let foundDeck = state.decks.find(d => d.deck_id === deck_id)
    let updatedDeck = {...foundDeck!, deck_cards: state.selectedDeck.deck_cards.filter(card => card.inventory_card_id !== deck_card.inventory_card_id)};

    return {
      ...state,
      selectedDeck: updatedDeck
    };

  }),
  on(removeCardFromDeckFail, (state) => ({...state, isLoading: false, hasError: true})),
)
