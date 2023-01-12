import { createReducer, on } from "@ngrx/store";
import {
  addCardtoInventory,
  addCardtoInventoryFail,
  addCardtoInventorySuccess,
  getInventory,
  getInventoryFail,
  getInventorySuccess
} from "./inventory.actions";
import { InventoryState } from "./models/inventory-state.model";
import jwt_decode from "jwt-decode";

const initialState: InventoryState = {
    isLoading: false,
    hasError: false,
    inventory: {
      inventory_id: "",
      created_at: "",
      last_modified: "",
      total_value: "",
      inventory_cards: []
  }
}

export const inventoryReducer = createReducer(
  initialState,
  on(addCardtoInventory, (state) => ({...state, isLoading: true})),
  on(addCardtoInventorySuccess, (state) => ({...state, isLoading: false, hasError: false})),
  on(addCardtoInventoryFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getInventory, (state) => ({...state, isLoading: true})),
  on(getInventorySuccess, (state) => ({...state, isLoading: false, hasError: false})),
  on(getInventoryFail, (state) => ({...state, isLoading: false, hasError: true})),
)
