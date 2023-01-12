import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, filter } from 'rxjs/operators';
import { WebsocketService } from "src/app/services/websocket/websocket.service";
import {
  searchCardByKeyword,
  searchCardByKeywordSuccess,
  searchCardByKeywordFail,
} from "./card.actions";

@Injectable()
export class CardEffects {

  constructor(
    private readonly actions$: Actions,
    private readonly websocketService: WebsocketService
  ) { }

  public searchedCardByKeywordEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchCardByKeyword),
      tap(({query}) => this.websocketService.sendSearchCardByKeywordMessage(query)),
      mergeMap(() => {
        return this.websocketService.dataUpdates$().pipe(
          filter((event: any) => {
            console.log("Incoming event: ", event);
            return event['event_type'] === 'SEARCH_CARD_RESULT'
          }),
          map((event: any) => searchCardByKeywordSuccess({cards: event["data"]})),
          catchError((error) => {
            console.log(error);
            return of(searchCardByKeywordFail({error: true}))
          })
        )
      })
    )
  );
}
