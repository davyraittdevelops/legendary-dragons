export interface Card {
  card_name: string;
  released_at: string;
  set_type: string;
  rarity: string;
  prices: string;
  is_multifaced: boolean;
  card_faces: CardFace[];
}

export interface CardFace {
  oracle_text: string;
  image_url: string;
}
