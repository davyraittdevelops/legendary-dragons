import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { AppState } from "src/app/app.state";
import { WebsocketService } from "src/app/services/websocket/websocket.service";

import {
  getWishlist,
  getWishlistFail,
  getWishlistSuccess,
  createWishlistItem,
  createWishlistItemFail,
  createWishlistItemSuccess,
  removeWishlistItem,
  removeWishlistItemFail,
  removeWishlistItemSuccess,
  createAlert,
  createAlertFail,
  createAlertSuccess,
  getAlerts,
  getAlertsSuccess,
  getAlertsFail, removeAlert, removeAlertSuccess, removeAlertFail
} from "./wishlist.actions";

@Injectable()
export class WishlistEffects {

  constructor(
    private readonly actions$: Actions,
    private readonly websocketService: WebsocketService,
    private store: Store<AppState>
  ) { }

  public getWishlistEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWishlist),
      tap(() => this.websocketService.sendGetWishlistMessage()),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'GET_WISHLIST_RESULT'
          }),
          map((event: any) => getWishlistSuccess({wishlist_items: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(getWishlistFail({error: true}))
          })
        )
      })
    )
  );


  public getAlertsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAlerts),
      tap(({wishlist_item_id}) => this.websocketService.sendGetAlertsMessage(wishlist_item_id)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'GET_ALERT_RESULT'
          }),
          map((event: any) => getAlertsSuccess({alert_items: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(getAlertsFail({error: true}))
          })
        )
      })
    )
  );

  public createWishlistItemEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createWishlistItem),
      tap(({wishlist_item}) => this.websocketService.sendCreateWishlistItemMessage(wishlist_item)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'INSERT_WISHLIST_ITEM_RESULT'
          }),
          map((event: any) => createWishlistItemSuccess({wishlist_item: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(createWishlistItemFail({error: true}))
          })
        )
      })
    )
  );

  public createAlertEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createAlert),
      tap(({alert_item, wishlist_item_id}) => this.websocketService.sendCreateAlert(alert_item, wishlist_item_id)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'INSERT_ALERT#AVAILABILITY_RESULT' || event['event_type'] === 'INSERT_ALERT#PRICE_RESULT' || event['event_type'] === 'MODIFY_ALERT#PRICE_RESULT'
          }),
          map((event: any) => createAlertSuccess({alert_item: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(createAlertFail({error: true}))
          })
        )
      })
    )
  );

  public removeWishlistItemEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeWishlistItem),
      tap(({wishlist_item_id}) => this.websocketService.sendRemoveWishlistItemMessage(wishlist_item_id)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'REMOVE_WISHLIST_ITEM_RESULT'
          }),
          map((event: any) => removeWishlistItemSuccess({wishlist_item_id: event["data"].wishlist_item_id})),
          catchError((error) => {
            console.log(error);
            return of(removeWishlistItemFail({error: true}))
          })
        )
      })
    )
  );

  public removeAlertEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeAlert),
      tap(({alert_item, wishlist_item_id}) => this.websocketService.sendRemoveAlertMessage(alert_item, wishlist_item_id)),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            return event['event_type'] === 'REMOVE_ALERT#PRICE_RESULT' || event['event_type'] === 'REMOVE_ALERT#AVAILABILITY_RESULT'
          }),
          map((event: any) => removeAlertSuccess({alert_item: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(removeAlertFail({error: true}))
          })
        )
      })
    )
  );
}
