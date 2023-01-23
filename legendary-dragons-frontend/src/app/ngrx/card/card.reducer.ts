import { createReducer, on } from "@ngrx/store";
import {
  clearSearchResult, getCard, getCardFail, getCardSuccess, searchCardByKeyword,
  searchCardByKeywordFail,
  searchCardByKeywordSuccess, updateCardQuality
} from "./card.actions";
import { CardState } from "./models/card-state.model";

const initialState: CardState = {
  isLoading: false,
  hasError: false,
  query: "",
  searchedCards: [],
  page: 0,
  itemsPerPage: 1,
  card_details: {
    card: {
      card_name: '',
      cardmarket_id: '',
      collector_number: '',
      created_at: '',
      entity_type: '',
      is_multifaced: false,
      last_modified: '',
      oracle_id: '',
      prices: {
        usd_foil: '',
        usd_etched: '',
        eur_foil: '',
        tix: '',
        eur: ''
      },
      rarity: '',
      released_at: '',
      scryfall_id: '',
      set_code: '',
      set_id: '',
      set_name: '',
      set_type: ''
    },
    card_faces: []
  }
}

export const cardReducer = createReducer(
  initialState,
  on(searchCardByKeyword, (state, { query }) => ({...state, isLoading: true, query: query, searchedCards: []})),
  on(searchCardByKeywordFail, (state) => ({...state, isLoading: false, hasError: true, searchedCards: []})),
  on(searchCardByKeywordSuccess, (state, {cards}) => {
    const newCards = [...state.searchedCards, ...cards];
    return {...state, isLoading: false, hasError: false, searchedCards: newCards}
  }),
  on(clearSearchResult, (state) => ({...state, searchedCards: []})),
  on(updateCardQuality, (state, { card, quality }) => {
    let foundCard = state.searchedCards.find(c => c.scryfall_id === card.scryfall_id)

    let updatedCard = {...foundCard!, quality: quality};
    let updatedCards = state.searchedCards.map(c => c.scryfall_id === updatedCard.scryfall_id ? updatedCard : c);

    return {
      ...state,
      searchedCards: updatedCards
    };
  }),
  on(getCard, (state, {scryfall_id}) => ({...state, isLoading: true})),
  on(getCardFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getCardSuccess, (state, {card}) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      card_details: card
    };
  }),
)
