import { Inventory } from "src/app/models/inventory.model";

export interface InventoryState {
  isLoading: boolean;
  hasError: boolean;
  inventory: Inventory;
  paginatorKey: any;
  pages: PaginatorKey[];
  currentPageIndex: number;
}

export interface PaginatorKey {
  PK?: string;
  SK?: string;
}

export interface Paginator {
  paginatorKey: PaginatorKey;
  pages: PaginatorKey[];
  currentPageIndex: number;
}
