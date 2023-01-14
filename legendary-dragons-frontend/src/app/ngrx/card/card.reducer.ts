import { createReducer, on } from "@ngrx/store";
import {
  searchCardByKeyword,
  searchCardByKeywordFail,
  searchCardByKeywordSuccess,
  clearSearchResult
} from "./card.actions";
import { CardState } from "./models/card-state.model";

const initialState: CardState = {
  isLoading: false,
  hasError: false,
  query: "",
  searchedCards: []
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
)
