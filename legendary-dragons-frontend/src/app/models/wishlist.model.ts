export interface WishlistItem {
  wishlist_item_id: string
  oracle_id: string
  card_name: string
  market_id: string
  created_at: string
  last_modified: string
  image_url: string
  card_market_id: string
}

export interface WishlistAlert {
  card_market_id: string
  price_point: string
  alert_id: string
  entity_type: string
}

export interface WishlistAlertRequest {
  card_market_id: string
  price_point: string
  alert_id: string
  alert_type: string
}
