import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { WebsocketService } from "src/app/services/websocket/websocket.service";

import {
  addCardtoInventory,
  addCardtoInventoryFail,
  addCardtoInventorySuccess,
  removeCardFromInventory,
  removeCardFromInventoryFail,
  removeCardFromInventorySuccess,
  getInventory,
  getInventoryFail,
  getInventorySuccess
} from "./inventory.actions";

@Injectable()
export class InventoryEffects {

  constructor(
    private readonly actions$: Actions,
    private readonly websocketService: WebsocketService,
  ) { }

  public addCardtoInventoryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCardtoInventory),
      tap(({inventoryCard, inventoryId}) => this.websocketService.sendAddCardToInventoryMessage(inventoryId, inventoryCard)),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'INSERT_INVENTORY_CARD_RESULT'
          }),
          map((event: any) => addCardtoInventorySuccess({inventoryCard: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(addCardtoInventoryFail({error: true}))
          })
        )
      })
    )
  );

  public removeCardFromInventoryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCardFromInventory),
      tap(({inventoryCardId, inventoryId}) => this.websocketService.sendRemoveCardFromInventoryMessage(inventoryCardId, inventoryId)),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'REMOVE_INVENTORY_CARD_RESULT'
          }),
          map((event: any) => removeCardFromInventorySuccess({inventoryCard: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(removeCardFromInventoryFail({error: true}))
          })
        )
      })
    )
  );

  public getInventoryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getInventory),
      tap(() => this.websocketService.sendGetInventoryMessage()),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'GET_INVENTORY_RESULT'
          }),
          map((event: any) => getInventorySuccess({inventory: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(getInventoryFail({error: true}))
          })
        )
      })
    )
  );
}
