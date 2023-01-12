import { Inventory } from "src/app/models/inventory.model";

export interface InventoryState {
  isLoading: boolean;
  hasError: boolean;
  inventory: Inventory;
}
