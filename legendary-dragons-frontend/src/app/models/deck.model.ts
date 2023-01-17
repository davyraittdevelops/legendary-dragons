import { Card } from "./card.model";

export interface Deck {
  name: string;
  deck_type: string;
  total_value: string;
  created_at: Date;
  last_modified: Date;
  image_url: string;
  deck_cards: DeckCard[];

  side_deck: SideDeck;
}

export interface SideDeck {
  created_at: Date;
  last_modified: Date;
  deck_cards: DeckCard[];
}

export interface DeckCard {
  oracle_id: string,
  card_name: string,
  colors: string[];
  prices: object;
  rarity: string;
  quality: string;
  image_url: string;
}
