import { createAction, props } from '@ngrx/store';
import {Deck, DeckCard} from 'src/app/models/deck.model';
import { InventoryCard } from 'src/app/models/inventory.model';

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

export const removeDeck = createAction(
  '[Deck Component] Delete Deck',
  props<{ deck_id: string }>(),
);

export const removeDeckFail = createAction(
  '[Deck Component] Delete Deck Fail',
  props<{ error: boolean }>(),
);

export const removeDeckSuccess = createAction(
  '[Deck Component] Delete Deck Success',
  props<{deck: Deck}>(),
);

export const getDecks = createAction(
  '[Deck Component] Get Decks'
);

export const getDecksFail = createAction(
  '[Deck Component] Get Decks Fail',
  props<{ error: boolean }>(),
);

export const getDecksSuccess = createAction(
  '[Deck Component] Get Decks Success',
  props<{decks: Deck[]}>(),
);

export const getDeck = createAction(
  '[Deck Detail Component] Get Deck',
  props<{ deck_id: string}>(),
);

export const getDeckFail = createAction(
  '[Deck Detail Component]  Get Deck Fail',
  props<{ error: boolean }>(),
);

export const getDeckSuccess = createAction(
  '[Deck Detail Component] Get Deck Success',
  props<{deck: Deck}>(),
);

export const addCardToDeck = createAction(
  '[Deck Detail Component] Add Card To Deck',
  props<{ deck_id: string, deck_type: string, inventory_card: InventoryCard, deck_name: string}>(),
);

export const addCardToDeckFail = createAction(
  '[Deck Detail Component] Add Card To Deck Fail',
  props<{ error: boolean }>(),
);

export const addCardToDeckSuccess = createAction(
  '[Deck Detail Component] Add Card To Deck Success',
  props<{deckCard: DeckCard, deckType: string}>(),
);

export const removeCardFromDeck = createAction(
  '[Deck Detail Component] Remove Card From Deck',
  props<{ deck_id: string, deck_card: DeckCard, deck_type: string, inventory_id: string }>(),
);

export const removeCardFromDeckFail = createAction(
  '[Deck Detail Component] Remove Card From Deck Fail',
  props<{ error: boolean }>(),
);

export const removeCardFromDeckSuccess = createAction(
  '[Deck Detail Component] Remove Card From Deck Success',
  props<{deck_id: string, deck_card: DeckCard, deck_type: string}>(),
);

export const moveDeckCard = createAction(
  '[Deck Detail Component] Move Card From Deck',
  props<{ deck_id: string, deck_card_id: string, deck_type: string }>(),
);

export const moveDeckCardFail = createAction(
  '[Deck Detail Component] Move Card From Deck Fail',
  props<{ error: boolean }>(),
);

export const moveDeckCardSuccess = createAction(
  '[Deck Detail Component] Move Card From Deck Success',
  props<{deck_card: DeckCard, deck_type: string}>(),
);

export const updateDeck = createAction(
  '[Deck Detail Component] Update Deck'
);

export const updateDeckFail = createAction(
  '[Deck Detail Component] Update Deck Fail',
  props<{ error: boolean }>(),
);

export const updateDeckSuccess = createAction(
  '[Deck Detail Component] Update Deck Success',
  props<{ deck: Deck}>()
);
