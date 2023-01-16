import { createAction, props } from '@ngrx/store';
import { Deck } from 'src/app/models/deck.model';

export const createDeck = createAction(
  '[Deck Component] Create Deck',
  props<{ deck_name: string, deck_type: string }>(),
);

export const createDeckFail = createAction(
  '[Deck Component] Create Deck Fail',
  props<{ error: boolean }>(),
);

export const createDeckSuccess = createAction(
  '[Deck Component] Create Deck Success',
  props<{deck: Deck}>(),
);

export const deleteDeck = createAction(
  '[Deck Component] Delete Deck',
  props<{ deck_id: string }>(),
);

export const deleteDeckFail = createAction(
  '[Deck Component] Delete Deck Fail',
  props<{ error: boolean }>(),
);

export const deleteDeckSuccess = createAction(
  '[Deck Component] Delete Deck Success',
  props<{deck: Deck}>(),
);
