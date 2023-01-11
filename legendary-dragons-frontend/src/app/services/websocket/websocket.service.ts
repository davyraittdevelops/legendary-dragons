import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$: WebSocketSubject<any> | undefined;

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

  public dataUpdates$() {
    console.log("connecting observable")
    return this.connect().asObservable();
  }

  closeConnection() {
    console.log("closing websocket")
    this.connect().complete();
  }

  constructor() { }
}
