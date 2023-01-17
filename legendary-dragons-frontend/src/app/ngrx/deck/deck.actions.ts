import { createAction, props } from '@ngrx/store';
import {Deck, DeckCard} from 'src/app/models/deck.model';
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
  '[Deck Component] Get Cards From Deck',
  props<{ deck_id: string}>(),
);

export const getCardsFromDeckFail = createAction(
  '[Deck Component]  Get Cards From Deck Fail',
  props<{ error: boolean }>(),
);

export const getCardsFromDeckSuccess = createAction(
  '[Deck Component] Get Cards From Deck Success',
  props<{deck_cards: DeckCard[]}>(),
);