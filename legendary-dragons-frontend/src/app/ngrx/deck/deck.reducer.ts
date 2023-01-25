import {createReducer, on} from "@ngrx/store";
import {DeckType} from "src/app/models/deck-type.enum";
import {
  addCardToDeck,
  addCardToDeckFail,
  addCardToDeckSuccess,
  createDeck,
  createDeckFail,
  createDeckSuccess,
  getDeck,
  getDeckFail,
  getDecks,
  getDecksFail,
  getDecksSuccess,
  getDeckSuccess,
  moveDeckCard,
  moveDeckCardFail,
  moveDeckCardSuccess,
  removeCardFromDeck,
  removeCardFromDeckFail,
  removeCardFromDeckSuccess,
  removeDeck,
  removeDeckFail,
  removeDeckSuccess,
  updateDeckFail,
  updateDeckSuccess
} from "./deck.actions";
import {DeckState} from "./models/deck-state.model";

const initialState: DeckState = {
  isLoading: false,
  isDeckLoading: false,
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
  on(getDeck, (state, {deck_id}) => ({...state, isLoading: true})),
  on(getDeckFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getDeckSuccess, (state, {deck}) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      selectedDeck: deck
    };
  }),
  on(addCardToDeck, (state, {deck_id, deck_type, inventory_card}) => ({...state, isDeckLoading: true})),
  on(addCardToDeckSuccess, (state, {deckCard, deckType}) => {
    let newSelectedDeck = {...state.selectedDeck};

    if (deckType == DeckType.SIDE)
      newSelectedDeck.side_deck_cards = [deckCard, ...state.selectedDeck.side_deck_cards];
    else
      newSelectedDeck.deck_cards = [deckCard, ...state.selectedDeck.deck_cards];

    return {
      ...state,
      hasError: false,
      isDeckLoading: false,
      selectedDeck: newSelectedDeck
    };

  }),
  on(addCardToDeckFail, (state) => ({...state, isDeckLoading: false, hasError: true})),
  on(removeCardFromDeck, (state, {deck_id, deck_card, inventory_id}) => ({...state, isDeckLoading: true})),
  on(removeCardFromDeckSuccess, (state, {deck_id, deck_card, deck_type}) => {
    let newSelectedDeck = {...state.selectedDeck};
    if (deck_type == DeckType.SIDE)
      newSelectedDeck.side_deck_cards = newSelectedDeck.side_deck_cards.filter(card => card.inventory_card_id !== deck_card.inventory_card_id);
    else
      newSelectedDeck.deck_cards = newSelectedDeck.deck_cards.filter(card => card.inventory_card_id !== deck_card.inventory_card_id);

    return {
      ...state,
      hasError: false,
      isDeckLoading: false,
      selectedDeck: newSelectedDeck
    };

  }),
  on(removeCardFromDeckFail, (state) => ({...state, isDeckLoading: false, hasError: true})),
  on(moveDeckCard, (state, {deck_id, deck_card_id, deck_type}) => ({...state, isDeckLoading: true})),
  on(moveDeckCardSuccess, (state, {deck_card, deck_type}) => {
    let newSelectedDeck = {...state.selectedDeck};

    if (deck_type == DeckType.SIDE) {
      newSelectedDeck.side_deck_cards = [deck_card, ...state.selectedDeck.side_deck_cards];
      newSelectedDeck.deck_cards = newSelectedDeck.deck_cards.filter(card => card.inventory_card_id !== deck_card.inventory_card_id);
    } else {
      newSelectedDeck.deck_cards = [deck_card, ...state.selectedDeck.deck_cards];
      newSelectedDeck.side_deck_cards = newSelectedDeck.side_deck_cards.filter(card => card.inventory_card_id !== deck_card.inventory_card_id);
    }
    return {
      ...state,
      hasError: false,
      isDeckLoading: false,
      selectedDeck: newSelectedDeck
    };

  }),

  on(moveDeckCardFail, (state) => ({...state, isDeckLoading: false, hasError: true})),
  on(updateDeckSuccess, (state, {deck}) => {
    let selectedDeck = {...state.selectedDeck};
    selectedDeck.total_value = deck.total_value;

    return {
      ...state,
      hasError: false,
      isDeckLoading: false,
      selectedDeck: selectedDeck
    };
  }),
  on(updateDeckFail, (state) => ({...state, hasError: true})),
)
