export interface Card {
  scryfall_id: string;
  collector_number: string;
  cardmarked_id: number | null;
  oracle_id: string;
  card_name: string;
  mana_cost: string;
  oracle_text: string;
  released_at: string;
  set_id: string;
  set_name: string;
  set_code: string;
  set_type: string;
  rarity: string;
  quality: string;
  prices: object;
  is_multifaced: boolean;
  card_faces: CardFace[];
}

export interface CardFace {
  oracle_text: string;
  image_url: string;
  card_name: string;
  multiverse_id: number | null;
  mana_cost: string;
  colors: string[];
  type_line: string;
}
