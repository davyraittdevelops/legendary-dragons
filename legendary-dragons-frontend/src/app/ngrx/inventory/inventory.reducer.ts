import {createReducer, on} from "@ngrx/store";
import {
  addCardtoInventory,
  addCardtoInventoryFail,
  addCardtoInventorySuccess,
  clearPaginator,
  getInventory,
  getInventoryFail,
  getInventorySuccess,
  removeCardFromInventory,
  removeCardFromInventoryFail,
  removeCardFromInventorySuccess,
  searchInventoryCard,
  searchInventoryCardFail,
  searchInventoryCardSuccess,
  updateInventoryCardFail,
  updateInventoryCardSuccess,
  updateInventoryFail,
  updateInventorySuccess
} from "./inventory.actions";
import {InventoryState, PaginatorKey} from "./models/inventory-state.model";

const initialState: InventoryState = {
  isLoading: false,
  hasError: false,
  inventory: {
    inventory_id: "",
    created_at: "",
    last_modified: "",
    total_value: "",
    total_cards: 0,
    inventory_cards: []
  },
  paginatorKey: {},
  pages: [],
  currentPageIndex: 0,
}

const inventoryPaginatorUpdateState = (state: InventoryState, paginatorKey: PaginatorKey) => {
  const foundIndex = state.pages.findIndex((page) => page.SK === paginatorKey.SK);

    if (foundIndex > -1)
      return {...state, isLoading: true, hasError: false, currentPageIndex: foundIndex};

  const pages = [...state.pages, paginatorKey];
  return {...state, isLoading: true, pages, currentPageIndex: state.pages.length}
};

export const inventoryReducer = createReducer(
  initialState,
  on(addCardtoInventory, (state) => ({...state, isLoading: true})),
  on(addCardtoInventorySuccess, (state, {inventoryCard}) => {
    const foundIndex = state.inventory.inventory_cards.findIndex((card) => card.card_id === inventoryCard.card_id);

    if (foundIndex > -1)
      return {...state, isLoading: false, hasError: false};

    const cards = [...state.inventory.inventory_cards, inventoryCard];
    const newInventory = {...state.inventory, inventory_cards: cards, total_cards: (+state.inventory.total_cards) + 1};

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
        total_cards: (+state.inventory.total_cards) - 1,
        inventory_cards: state.inventory.inventory_cards.filter(card => card.card_id !== inventoryCard.card_id)
      }
    };
  }),
  on(removeCardFromInventoryFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getInventory, (state, {paginatorKey}) => inventoryPaginatorUpdateState(state, paginatorKey)),
  on(getInventoryFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(getInventorySuccess, (state, {inventory, paginatorKey}) => {
    const inventoryCards: number =+ inventory.total_cards;

    const inventoryInit = {
      ...state,
      hasError: false,
      isLoading: false,
      paginatorKey: paginatorKey,
      inventory: inventory,
      total_cards : inventoryCards,
    }

    const newInventoryResult = {
      ...state.inventory,
      inventory_cards: inventory.inventory_cards
    };

    if (state.currentPageIndex == 0) {
      return inventoryInit;
    }

    return {
      ...inventoryInit,
      inventory: newInventoryResult
    };
  }),
  on(updateInventoryCardSuccess, (state, {inventoryCard}) => {
    const inventory = {...state.inventory};
    const filteredInventoryCards = inventory.inventory_cards.filter((card) => card.card_id !== inventoryCard.card_id);
    inventory.inventory_cards = [...filteredInventoryCards, inventoryCard];

    return {...state, hasError: false, inventory}
  }),
  on(updateInventoryCardFail, (state) => ({...state, hasError: true})),
  on(updateInventorySuccess, (state, {inventory}) => {
    let current_inventory = {...state.inventory};
    current_inventory.total_value = inventory.total_value;

    return {
      ...state,
      hasError: false,
      isLoading: false,
      inventory: current_inventory
    };
  }),
  on(updateInventoryFail, (state) => ({...state, hasError: true})),
  on(searchInventoryCard, (state, {paginatorKey}) => inventoryPaginatorUpdateState(state, paginatorKey)),
  on(searchInventoryCardSuccess, (state, {inventoryCards, paginatorKey, totalCards}) => {
    const inventory = {
      ...state.inventory,
      total_cards: totalCards,
      inventory_cards: inventoryCards
    };

    return {...state, isLoading: false, hasError: false, inventory, paginatorKey}
  }),
  on(searchInventoryCardFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(clearPaginator, (state) => ({...state, paginatorKey: {}, pages: [], currentPageIndex: 0})),
)
