export interface Deck {
  deck_id: string;
  deck_name: string;
  deck_type: string;
  total_value: string;
  created_at: Date;
  last_modified: Date;
  image_url: string;
  deck_cards: DeckCard[];
  side_deck_cards: DeckCard[];
}

export interface DeckCard {
  inventory_card_id: string;
  oracle_id: string,
  card_name: string,
  colors: string[];
  prices: object;
  rarity: string;
  quality: string;
  image_url: string;
}
