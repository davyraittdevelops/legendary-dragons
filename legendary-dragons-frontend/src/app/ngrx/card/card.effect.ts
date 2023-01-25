import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap , tap } from 'rxjs/operators';
import { WebsocketService } from "src/app/services/websocket/websocket.service";
import {
  getCard,
  getCardFail,
  getCardSuccess,
  searchCardByKeyword, searchCardByKeywordFail, searchCardByKeywordSuccess
} from "./card.actions";
import {getDeck, getDeckFail, getDeckSuccess} from "../deck/deck.actions";

@Injectable()
export class CardEffects {

  constructor(
    private readonly actions$: Actions,
    private readonly websocketService: WebsocketService
  ) { }

  public searchCardByKeywordEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(searchCardByKeyword),
    tap(({query}) => this.websocketService.sendSearchCardByKeywordMessage(query)),
    switchMap(() => {
      return this.websocketService.dataUpdates$().pipe(
        filter((event: any) => {
          return event['event_type'] === 'SEARCH_CARD_RESULT'
        }),
        map((event: any) => searchCardByKeywordSuccess({cards: event["data"]})),
        catchError((error) => {
          console.log(error);
          return of(searchCardByKeywordFail)
        })
      )
    })
  ))

  public getCardEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCard),
      tap(({scryfall_id}) => {
        this.websocketService.sendGetCardMessage(scryfall_id)
      }),
      switchMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            console.log(event)
            return event['event_type'] === 'GET_CARD_RESULT'
          }),
          map((event: any) => {
            const cardData = event["data"];
            return getCardSuccess({card: cardData})
          }),
          catchError((error) => {
            console.log(error);
            return of(getCardFail({error: true}))
          })
        )
      })
    )
  );
}
