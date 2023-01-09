import { AppState } from "../app-state.interface";
import { createSelector } from "@ngrx/store";

export const selectUser = (state: AppState) => state.user

export const isLoadingSelector = createSelector(selectUser, (state) => state.isLoading);
export const userErrorSelector = createSelector(selectUser, (state) => state.hasUserError);
