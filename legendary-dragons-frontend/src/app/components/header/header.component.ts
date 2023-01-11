import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { User } from 'src/app/models/user.model';
import { logoutUser } from 'src/app/ngrx/user/user.actions';
import { isLoggedInSelector, userSelector } from 'src/app/ngrx/user/user.selectors';
import { AppState } from "../../app.state";
import {WebsocketService} from "../../services/websocket/websocket.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<User>;

  constructor(private appStore: Store<AppState>, private router: Router,
              private websocketService : WebsocketService) {
    this.isLoggedIn$ = this.appStore.select(isLoggedInSelector);
    this.user$ = this.appStore.select(userSelector);
  }

  ngOnInit(): void { }

  logout(): void {
    this.websocketService.closeConnection();
    this.appStore.dispatch(logoutUser());
    this.router.navigate(['']);
  }
}
