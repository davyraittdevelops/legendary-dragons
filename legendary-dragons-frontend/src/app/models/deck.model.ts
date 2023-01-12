import { Card } from "./card.model";

export interface Deck {
  name: string,
  deck_type: string,
  total_value: string,
  created_at: Date,
  last_modified: Date,
  image_url: string;
  cards: Card[]
}
