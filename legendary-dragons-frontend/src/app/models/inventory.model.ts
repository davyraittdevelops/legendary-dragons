export interface Inventory {
  inventory_id: string;
  created_at: string;
  last_modified: string;
  total_value: string;
  inventory_cards: InventoryCard[];
}

export interface InventoryCard {
  card_id: string;
  scryfall_id: string;
  created_at: string;
  last_modified: string;
  oracle_id: string;
  card_name: string;
  oracle_text: string;
  mana_cost: string;
  colors: string[];
  prices: object;
  rarity: string;
  quality: string;
  deck_location: string;
  set_name: string;
  power: string;
  toughness: string;
  image_url: string;
}


export interface InventoryCardRequest {
  scryfall_id: string;
  oracle_id: string;
  card_name: string;
  mana_cost: string;
  oracle_text: string;
  set_name: string;
  colors: string[];
  prices: object;
  rarity: string;
  quality: string;
  deck_location: string;
  image_url: string;
}
