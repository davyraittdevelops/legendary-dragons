import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap , tap } from 'rxjs/operators';
import { WebsocketService } from "src/app/services/websocket/websocket.service";
import {
  searchCardByKeyword, searchCardByKeywordFail, searchCardByKeywordSuccess
} from "./card.actions";

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
}
