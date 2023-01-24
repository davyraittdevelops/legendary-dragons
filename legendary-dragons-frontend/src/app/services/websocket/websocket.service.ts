import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {InventoryCard} from 'src/app/models/inventory.model';
import {WishlistAlertRequest, WishlistItem} from 'src/app/models/wishlist.model';
import { PaginatorKey } from 'src/app/ngrx/inventory/models/inventory-state.model';
import {environment} from 'src/environments/environment';
import {DeckCard} from "../../models/deck.model";

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
    this.sendMessage('searchCardsByKeywordReq', {query})
  }

  sendAddCardToInventoryMessage(inventory_id: string, card: any) {
    this.sendMessage(
      'addCardToInventoryReq',
      {inventory_id: inventory_id, inventory_card: card}
    )
  }

  sendRemoveCardFromInventoryMessage(inventory_card_id: string, inventory_id: string) {
    this.sendMessage(
      'removeCardFromInventoryReq',
      {
        inventory_card_id: inventory_card_id,
        inventory_id: inventory_id
      }
    )
  }

  sendGetInventoryMessage(paginatorKey: PaginatorKey) {
    this.sendMessage('getInventoryReq', {paginatorKey});
  }

  sendCreateDeckMessage(deck_name: string, deck_type: string) {
    this.sendMessage('createDeckReq', {deck_name: deck_name, deck_type: deck_type});
  }

  sendRemoveDeckMessage(deck_id: string) {
    this.sendMessage('removeDeckReq', {deck_id: deck_id});
  }

  sendGetDecksMessage(): void {
    this.sendMessage('getDecksReq', {});
  }

  sendGetDeckMessage(deck_id : string) {
    this.sendMessage('getDeckReq', {deck_id});
  }

  sendAddCardToDeckMessage(deck_id : string, deck_type: string, inventory_card : InventoryCard, deck_name: string) {
    this.sendMessage('addCardToDeckReq', {
      deck_name, deck_id, deck_type, inventory_card
    });
  }

  sendRemoveCardFromDeckMessage(deck_id : string, deck_card : DeckCard, inventory_id: string) {
    this.sendMessage('removeCardFromDeckReq', {
      deck_id, deck_card, inventory_id
    });
  }

  sendGetWishlistMessage() {
    this.sendMessage('getWishlistReq', {});
  }

  sendCreateWishlistItemMessage(wishlist_item: WishlistItem) {
    this.sendMessage(
      'createWishlistItemReq',
      {wishlist_item: wishlist_item,
        deck_id: 'not available for now'
      }

    )
  }

  sendRemoveWishlistItemMessage(wishlist_item_id: string) {
    this.sendMessage(
      'removeWishlistItemReq',
      {
        wishlist_item_id: wishlist_item_id
      }
    )
  }

  sendCreateAlert(alert_item: WishlistAlertRequest, wishlist_item_id: string) {
    this.sendMessage('createAlertReq', {alert_item, wishlist_item_id});
  }

  sendGetAlertsMessage(wishlist_item_id : string) {
    this.sendMessage('getAlertsReq', {wishlist_item_id});
  }

  sendRemoveAlertMessage(alert_item: WishlistAlertRequest, wishlist_item_id: string) {
    this.sendMessage('removeAlertReq', {alert_item, wishlist_item_id});
  }

  sendGetCardMessage(scryfall_id: any) {
    this.sendMessage('getCardReq', {scryfall_id});
  }

  sendMoveDeckCardMessage(deck_id: string, deck_card: string, deck_type: string) {
    this.sendMessage('moveDeckCardReq', {deck_id, deck_card, deck_type});
  }
}
