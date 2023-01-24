import { createAction, props } from '@ngrx/store';
import { Inventory, InventoryCard, InventoryCardRequest } from 'src/app/models/inventory.model';
import { PaginatorKey } from './models/inventory-state.model';

export const addCardtoInventory = createAction(
  '[Add Card Component] Add To Inventory',
  props<{ inventoryCard: InventoryCardRequest, inventoryId: string }>()
);

export const addCardtoInventoryFail = createAction(
  '[Add Card Component] Add To Inventory Fail',
  props<{ error: boolean }>(),
);

export const addCardtoInventorySuccess = createAction(
  '[Add Card Component] Add To Inventory Success',
  props<{ inventoryCard: InventoryCard}>()
);

export const removeCardFromInventory = createAction(
  '[Add Card Component] Remove Card From Inventory',
  props<{ inventoryCardId: string, inventoryId: string }>()
);

export const removeCardFromInventoryFail = createAction(
  '[Add Card Component] Remove Card From Inventory Fail',
  props<{ error: boolean }>(),
);

export const removeCardFromInventorySuccess = createAction(
  '[Add Card Component] Remove Card From Inventory Success',
  props<{ inventoryCard: InventoryCard}>(),
);

export const getInventory = createAction(
  '[Inventory Component] Get Inventory',
  props<{paginatorKey: PaginatorKey}>()
);

export const getInventoryFail = createAction(
  '[Inventory Component] Get Inventory Fail',
  props<{ error: boolean }>(),
);

export const getInventorySuccess = createAction(
  '[Inventory Component] Get Inventory Success',
  props<{inventory: Inventory, paginatorKey: PaginatorKey}>(),
);

export const updateInventoryCard = createAction(
  '[Add Card Component] Update Inventory Card'
);

export const updateInventoryCardFail = createAction(
  '[Add Card Component] Update Inventory Card Fail',
  props<{ error: boolean }>(),
);

export const updateInventoryCardSuccess = createAction(
  '[Add Card Component] Update Inventory Card Success',
  props<{ inventoryCard: InventoryCard}>()
);

export const searchInventoryCard = createAction(
  '[Inventory Component] Search Inventory Card',
  props<{paginatorKey: PaginatorKey, filter: object, cardName: string}>()
);

export const searchInventoryCardFail = createAction(
  '[Inventory Component] Search Inventory Card Fail',
  props<{ error: boolean }>(),
);

export const searchInventoryCardSuccess = createAction(
  '[Inventory Component] Search Inventory Card Success',
  props<{inventoryCards: InventoryCard[], totalCards: number, paginatorKey: PaginatorKey}>(),
);

export const clearPaginator = createAction('[Inventory Page Component] Clear Paginator');
