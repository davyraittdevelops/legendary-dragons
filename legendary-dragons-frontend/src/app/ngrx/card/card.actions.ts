import { createAction, props } from '@ngrx/store';
import { Card } from 'src/app/models/card.model';
import {InventoryCard} from "../../models/inventory.model";

export const updateCardQuality = createAction(
  '[Add Card Component] Update Card Quality',
  props<{ card : Card, quality: string}>()
);
export const searchCardByKeyword = createAction(
  '[Add Card Component] Search',
  props<{ query: string }>()
);

export const searchCardByKeywordFail = createAction(
  '[Add Card Component] Search Fail',
  props<{ error: boolean }>(),
)

export const searchCardByKeywordSuccess = createAction(
  '[Add Card Component] Search Success',
  props<{ cards: Card[] }>()
)

export const clearSearchResult = createAction(
  '[Add Card Component] Clear Search Result',
)
