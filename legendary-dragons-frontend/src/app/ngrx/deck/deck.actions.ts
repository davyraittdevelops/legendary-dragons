import { createAction, props } from '@ngrx/store';
import {Deck, DeckCard} from 'src/app/models/deck.model';
import { InventoryCard } from 'src/app/models/inventory.model';
import {Card} from "../../models/card.model";

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

export const getCardsFromDeck = createAction(
  '[Deck Detail Component] Get Cards From Deck',
  props<{ deck_id: string}>(),
);

export const getCardsFromDeckFail = createAction(
  '[Deck Detail Component]  Get Cards From Deck Fail',
  props<{ error: boolean }>(),
);

export const getCardsFromDeckSuccess = createAction(
  '[Deck Detail Component] Get Cards From Deck Success',
  props<{deck_id: string, main_deck_cards: DeckCard[], side_deck_cards: DeckCard[]}>(),
);

export const addCardToDeck = createAction(
  '[Deck Detail Component] Add Card To Deck',
  props<{ deck_id: string, deck_type: string, inventory_card: InventoryCard }>(),
);

export const addCardToDeckFail = createAction(
  '[Deck Detail Component] Add Card To Deck Fail',
  props<{ error: boolean }>(),
);

export const addCardToDeckSuccess = createAction(
  '[Deck Detail Component] Add Card To Deck Success',
  props<{deck: Deck}>(),
);

export const removeCardFromDeck = createAction(
  '[Deck Detail Component] Remove Card From Deck',
  props<{ deck_id: string, inventory_card: InventoryCard }>(),
);

export const removeCardFromDeckFail = createAction(
  '[Deck Detail Component] Remove Card From Deck Fail',
  props<{ error: boolean }>(),
);

export const removeCardFromDeckSuccess = createAction(
  '[Deck Detail Component] Remove Card From Deck Success',
  props<{deck_id: string, deck_card: DeckCard}>(),
);

