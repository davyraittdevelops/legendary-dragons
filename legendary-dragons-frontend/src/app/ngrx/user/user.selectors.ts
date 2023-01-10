import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectUser = (state: AppState) => state.user

export const isLoadingSelector = createSelector(selectUser, (state) => state.isLoading);
export const userErrorSelector = createSelector(selectUser, (state) => state.hasError);
export const userSelector = createSelector(selectUser, (state) => state.user);
export const isLoggedInSelector = createSelector(selectUser, () => {
  const token = localStorage.getItem('token');
  return token != null;
});
