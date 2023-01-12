import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import {HttpHeaders} from "@angular/common/http";
import { Card } from 'src/app/models/card.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$: WebSocketSubject<any> | undefined;

  constructor() { }

  public connect(): WebSocketSubject<any> {
    const token = localStorage.getItem('token')  || '';
    const headers = new HttpHeaders().set("Authorization", token);

    console.log('headers ' , headers)
    console.log(token)

    if (!this.socket$ || this.socket$.closed) {
      console.log("succesfully connected to the websocket")
      this.socket$ = webSocket(environment.websocket_api_url + '?token=' + token);
    }
    return this.socket$;
  }

  public dataUpdates$(): Observable<any> {
    console.log("connecting observable")
    return this.connect().asObservable();
  }

  closeConnection() {
    console.log("closing websocket")
    this.connect().complete();
  }

  sendSearchCardByKeywordMessage(query: string) {
    if (!this.socket$) {
      console.log('Sending WebSocket message while socket doesnt exist');
      return;
    }

    console.log('Sending a WebSocket message');

    const message = {
      'action': 'searchCardsByKeywordReq',
      ...(query && { 'query': query }),
    };

    this.socket$.next(message);
  }

  sendAddCardToInventoryMessage(inventory_id: string, card: any) {
    if (!this.socket$) {
      console.log('Sending WebSocket message while socket doesnt exist');
      return;
    }

    console.log('Sending a WebSocket message');

    const message = {
      'action': 'addCardToInventoryReq',
      'inventory_id': inventory_id,
      'inventory_card': card
    };

    this.socket$.next(message);
  }

}
