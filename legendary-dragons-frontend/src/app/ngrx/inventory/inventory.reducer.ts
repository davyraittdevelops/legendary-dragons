import { createReducer, on } from "@ngrx/store";
import {
  addCardtoInventory,
  addCardtoInventoryFail,
  addCardtoInventorySuccess,
  getInventory,
  getInventoryFail,
  getInventorySuccess,
  removeCardFromInventory,
  removeCardFromInventoryFail,
  removeCardFromInventorySuccess
} from "./inventory.actions";
import { InventoryState } from "./models/inventory-state.model";

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
  on(addCardtoInventorySuccess, (state, {inventoryCard}) => {
    const foundIndex = state.inventory.inventory_cards.findIndex((card) => card.card_id === inventoryCard.card_id);

    if (foundIndex > -1)
      return {...state, isLoading: false, hasError: false};

    const cards = [...state.inventory.inventory_cards, inventoryCard];
    const newInventory = {...state.inventory, inventory_cards: cards};

    return {...state, isLoading: false, hasError: false, inventory: newInventory};
  }),
  on(addCardtoInventoryFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(removeCardFromInventory, (state) => ({...state, isLoading: true})),
  on(removeCardFromInventorySuccess, (state, { inventoryCard }) => {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      inventory: {
        inventory_id: state.inventory.inventory_id,
        created_at: state.inventory.created_at,
        last_modified: state.inventory.last_modified,
        total_value: state.inventory.total_value,
        inventory_cards: state.inventory.inventory_cards.filter(card => card.card_id !== inventoryCard.card_id)
      }
    };

  }),
  on(addCardtoInventoryFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getInventory, (state) => ({...state, isLoading: true})),
  on(getInventorySuccess, (state, {inventory}) => ({...state, isLoading: false, hasError: false, inventory})),
  on(getInventoryFail, (state) => ({...state, isLoading: false, hasError: true})),
)
