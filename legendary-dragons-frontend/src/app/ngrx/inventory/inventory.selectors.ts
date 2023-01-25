import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectInventory = (state: AppState) => state.inventory

export const isLoadingSelector = createSelector(selectInventory, (state) => state.isLoading);
export const errorSelector = createSelector(selectInventory, (state) => state.hasError);
export const inventorySelector = createSelector(selectInventory, (state) => state.inventory);
export const paginatorSelector = createSelector(
  selectInventory, (state) => {
    return {paginatorKey: state.paginatorKey, pages: state.pages, currentPageIndex: state.currentPageIndex}
  }
)
