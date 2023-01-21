export interface WishlistItem {
  wishlist_item_id: string
  oracle_id: string
  card_name: string
  market_id: string
  created_at: string
  last_modified: string
  image_url: string
}

export interface WishlistAlert {
  entity_type: string
  card_market_id: string
  price_point: string
  alert_id: string
}
