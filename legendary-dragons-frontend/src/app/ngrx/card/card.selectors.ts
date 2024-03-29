import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectCard = (state: AppState) => state.card;

export const isLoadingSelector = createSelector(selectCard, (state) => state.isLoading);
export const errorSelector = createSelector(selectCard, (state) => state.hasError);
export const searchedCardSelector = createSelector(selectCard, (state) => state.searchedCards);
export const querySelector = createSelector(selectCard, (state) => state.query);
export const cardDetailSelector = createSelector(selectCard, (state) => state.card_details);
