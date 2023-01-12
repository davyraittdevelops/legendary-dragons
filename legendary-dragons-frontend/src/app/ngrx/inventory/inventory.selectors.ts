import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";

export const selectInventory = (state: AppState) => state.inventory

export const isLoadingSelector = createSelector(selectInventory, (state) => state.isLoading);
export const inventoryErrorSelector = createSelector(selectInventory, (state) => state.hasError);
export const inventorySelector = createSelector(selectInventory, (state) => state.inventory);
