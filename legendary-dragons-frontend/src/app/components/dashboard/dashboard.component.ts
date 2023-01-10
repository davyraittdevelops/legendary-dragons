import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import { Router } from "@angular/router";
import { UserService } from "../../services/user/user.service";
import { Subscription } from "rxjs";
import {webSocket} from "rxjs/webSocket";
import {WebsocketService} from "../../services/websocket/websocket.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private appStore: Store<AppState>,
              private router: Router,
              private userService: UserService,
              private websocketService : WebsocketService) { }

  ngOnInit(): void {
    this.websocketService.dataUpdates$().subscribe((data: string) => {
      console.log('got data from websocket back' , data)
    })
  }

  ngOnDestroy(): void {

  }
}
