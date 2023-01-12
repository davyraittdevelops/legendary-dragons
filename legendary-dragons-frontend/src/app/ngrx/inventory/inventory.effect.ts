import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, filter } from 'rxjs/operators';
import { UserService } from "src/app/services/user/user.service";
import { WebsocketService } from "src/app/services/websocket/websocket.service";

import {
  addCardtoInventory,
  addCardtoInventoryFail,
  addCardtoInventorySuccess,
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
            console.log("Incoming event: ", event);
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

  public getInventoryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getInventory),
      tap(({inventoryId}) => this.websocketService.sendGetInventoryMessage(inventoryId)),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            console.log("Incoming event: ", event);
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
