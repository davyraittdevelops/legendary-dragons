import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectDeck = (state: AppState) => state.deck

export const isLoadingSelector = createSelector(selectDeck, (state) => state.isLoading);
export const errorSelector = createSelector(selectDeck, (state) => state.hasError);
export const decksSelector = createSelector(selectDeck, (state) => state.decks);
export const isDeckLoadingSelector = createSelector(selectDeck, (state) => state.isDeckLoading);

export const deckByIdSelector = createSelector(selectDeck, (state) => state.selectedDeck);
