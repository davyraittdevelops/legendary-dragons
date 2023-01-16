import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { WebsocketService } from "src/app/services/websocket/websocket.service";

import {
  createDeck,
  createDeckSuccess,
  createDeckFail,
  deleteDeck,
  deleteDeckSuccess,
  deleteDeckFail
} from "./deck.actions";

@Injectable()
export class DeckEffects {

  constructor(
    private readonly actions$: Actions,
    private readonly websocketService: WebsocketService,
  ) { }

  public addCardtoInventoryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDeck),
      tap(({deck_name, deck_type}) => this.websocketService.sendCreateDeckMessage(deck_name, deck_type)),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'INSERT_DECK_RESULT'
          }),
          map((event: any) => createDeckSuccess({deck: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(createDeckFail({error: true}))
          })
        )
      })
    )
  );

  public removeDeckEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDeck),
      tap(({deck_id}) => this.websocketService.sendDeleteDeckMessage(deck_id)),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'DELETE_DECK_RESULT'
          }),
          map((event: any) => deleteDeckSuccess({deck: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(deleteDeckFail({error: true}))
          })
        )
      })
    )
  );
}
