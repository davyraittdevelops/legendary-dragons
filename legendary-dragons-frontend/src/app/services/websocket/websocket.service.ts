import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import {InventoryCard} from "../../models/inventory.model";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$: WebSocketSubject<any> | undefined;

  constructor() { }

  public connect(): WebSocketSubject<any> {
    const token = localStorage.getItem('token')  || '';

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(environment.websocket_api_url + '?token=' + token);
    }
    return this.socket$;
  }

  public dataUpdates$(): Observable<any> {
    return this.connect().asObservable();
  }

  closeConnection() {
    this.connect().complete();
  }

  private sendMessage(action: string, payload: any): void {
    if (!this.socket$) return;
    this.socket$.next({action, ...payload});
  }

  sendSearchCardByKeywordMessage(query: string) {
    if (!this.socket$) {
      return;
    }

    const message = {
      'action': 'searchCardsByKeywordReq',
      ...(query && { 'query': query }),
    };
    this.socket$.next(message);
  }

  sendAddCardToInventoryMessage(inventory_id: string, card: any) {
    if (!this.socket$) {
      return;
    }

    const message = {
      'action': 'addCardToInventoryReq',
      'inventory_id': inventory_id,
      'inventory_card': card
    };
    this.socket$.next(message);
  }

  sendRemoveCardFromInventoryMessage(inventory_card_id: any, inventory_id: any) {
    if (!this.socket$) {
      return;
    }

    const message = {
      'action': 'removeCardFromInventoryReq',
      'inventory_card_id': inventory_card_id,
      'inventory_id': inventory_id
    };
    this.socket$.next(message);
  }

  sendGetInventoryMessage() {
    if (!this.socket$) {
      return;
    }
    this.socket$.next({'action': 'getInventoryReq'});
  }

  sendGetCardsFromDeckMessage(deck_id : string) {
    if (!this.socket$) {
      return;
    }
    this.socket$.next({'action': 'getCardsFromDeckReq', 'deck_id': deck_id});
  }

  sendAddCardToDeckMessage(deck_id : string, inventory_card : InventoryCard) {
    console.log('sendAddCardToDeckMessage', inventory_card, deck_id)
    if (!this.socket$) {
      return;
    }
    this.socket$.next({
      'action': 'getCardsFromDeckReq',
      'deck_id': deck_id,
      'inventory_card': inventory_card
    });
  }

  sendCreateDeckMessage(deck_name: string, deck_type: string) {
    if (!this.socket$) {
      return;
    }

    const message = {
      'action': 'createDeckReq',
      'deck_name': deck_name,
      'deck_type': deck_type
    };
    this.socket$.next(message);
  }

  sendRemoveDeckMessage(deck_id: string) {
    if (!this.socket$) {
      return;
    }

    const message = {
      'action': 'removeDeckReq',
      'deck_id': deck_id,
    };
    this.socket$.next(message);
  }

  sendGetDecksMessage(): void {
    this.sendMessage("getDeckReq", {});
  }
}
