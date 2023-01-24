import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { WebsocketService } from "src/app/services/websocket/websocket.service";

import {
  addCardtoInventory,
  addCardtoInventoryFail,
  addCardtoInventorySuccess, getInventory,
  getInventoryFail,
  getInventorySuccess, removeCardFromInventory,
  removeCardFromInventoryFail,
  removeCardFromInventorySuccess, searchInventoryCard, searchInventoryCardFail, searchInventoryCardSuccess, updateInventoryCard, updateInventoryCardFail, updateInventoryCardSuccess
} from "./inventory.actions";

@Injectable()
export class InventoryEffects {

  constructor(
    private readonly actions$: Actions,
    private readonly websocketService: WebsocketService,
  ) { }

  public updateInventoryCardEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateInventoryCard),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => event['event_type'] === 'MODIFY_INVENTORY_CARD_RESULT'),
          map((event: any) => updateInventoryCardSuccess({inventoryCard: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(updateInventoryCardFail({error: true}))
          })
        )
      })
    )
  );

  public addCardtoInventoryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCardtoInventory),
      tap(({inventoryCard, inventoryId}) => this.websocketService.sendAddCardToInventoryMessage(inventoryId, inventoryCard)),
      switchMap(() => {
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
      switchMap(() => {
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
      tap(({paginatorKey}) => this.websocketService.sendGetInventoryMessage(paginatorKey)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => event['event_type'] === 'GET_INVENTORY_RESULT'),
          map((event: any) => {
            const inventory = event["data"];
            inventory["total_cards"] = event["total_cards"];
            return getInventorySuccess({inventory: event["data"], paginatorKey: event["paginatorKey"]})
          }),
          catchError((error) => {
            console.log(error);
            return of(getInventoryFail({error: true}))
          })
        )
      })
    )
  );

  public searchInventoryCardEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchInventoryCard),
      tap(({paginatorKey, filter, cardName}) => this.websocketService.sendSearchInventoryCardMessage(paginatorKey, filter, cardName)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'GET_INVENTORY_CARD_RESULT'
          }),
          map((event: any) => searchInventoryCardSuccess({
            inventoryCards: event["data"],
            totalCards: event["total_cards"],
            paginatorKey: event["paginatorKey"]
          })),
          catchError((error) => {
            console.log(error);
            return of(searchInventoryCardFail({error: true}))
          })
        )
      })
    )
  );
}
