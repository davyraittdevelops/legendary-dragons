import { createReducer, on } from "@ngrx/store";
import {
  searchCardByKeyword,
  searchCardByKeywordFail,
  searchCardByKeywordSuccess,
  clearSearchResult, updateCardQuality
} from "./card.actions";
import { CardState } from "./models/card-state.model";

const initialState: CardState = {
  isLoading: false,
  hasError: false,
  query: "",
  searchedCards: [],
  page: 0,
  itemsPerPage: 1
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
)
