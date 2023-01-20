export interface Wishlist {
  id: string;
  created_at: Date;
  last_modified: Date;
  wishlist_items: WishlistItem[];
}

export interface WishlistItem {
  wishlist_item_id: string
  oracle_id: string
  card_name: string
  market_id: string
  created_at: string
  last_modified: string
}
