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

export interface CardDetail {
  card : {
    card_name: string;
    cardmarket_id: string;
    collector_number: string;
    created_at: string;
    entity_type: string;
    is_multifaced: boolean;
    last_modified: string;
    oracle_id: string;
      prices: {
        usd_foil: string,
        usd_etched: string,
        eur_foil: string,
        tix: string,
        eur: string
        };
    rarity: string;
    released_at: string;
    scryfall_id: string;
    set_code: string;
    set_id: string;
    set_name: string;
    set_type: string;
  },
  card_faces: CardFaceDetail[]
}

export interface CardFaceDetail {
  card_name: string;
  colors: string[];
  created_at: string;
  entity_type: string;
  image_url: string;
  last_modified: string;
  mana_cost: string;
  multiverse_id: number | null;
  oracle_id: string;
  oracle_text: string;
}





