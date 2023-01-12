import { createReducer, on } from "@ngrx/store";
import {
  searchCardByKeyword,
  searchCardByKeywordFail,
  searchCardByKeywordSuccess
} from "./card.actions";
import { CardState } from "./models/card-state.model";

const initialState: CardState = {
  isLoading: false,
  hasError: false,
  searchedCards: []
}

export const cardReducer = createReducer(
  initialState,
  on(searchCardByKeyword, (state) => ({...state, isLoading: true, searchedCards: []})),
  on(searchCardByKeywordFail, (state) => ({...state, isLoading: false, hasError: true, searchedCards: []})),
  on(searchCardByKeywordSuccess, (state, {cards}) => {
    const newCards = [...state.searchedCards, ...cards];
    return {...state, isLoading: false, hasError: false, searchedCards: newCards}
  }),
)
