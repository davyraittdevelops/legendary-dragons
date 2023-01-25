import { createAction, props } from '@ngrx/store';
import {Card, CardDetail} from 'src/app/models/card.model';
import {InventoryCard} from "../../models/inventory.model";
import {Deck} from "../../models/deck.model";

export const searchCardByKeyword = createAction(
  '[Add Card Component] Search',
  props<{ query: string }>()
);

export const searchCardByKeywordFail = createAction(
  '[Add Card Component] Search Fail',
  props<{ error: boolean }>(),
);

export const searchCardByKeywordSuccess = createAction(
  '[Add Card Component] Search Success',
  props<{ cards: Card[] }>()
);

export const getCard = createAction(
  '[Card component] Get Card',
  props<{ scryfall_id: string}>(),
);

export const getCardFail = createAction(
  '[Card component] Get Fail',
  props<{ error: boolean }>(),
);

export const getCardSuccess = createAction(
  '[Card component] Get Fail',
  props<{ card: CardDetail }>(),
);

export const clearSearchResult = createAction(
  '[Add Card Component] Clear Search Result',
);

export const updateCardQuality = createAction(
  '[Add Card Component] Update Card Quality',
  props<{ card : Card, quality: string}>()
);
