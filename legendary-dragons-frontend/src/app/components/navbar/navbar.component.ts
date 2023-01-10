import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import {WebsocketService} from "../../services/websocket/websocket.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private appStore: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
  }

  toDashboard() {
    this.router.navigate(["/dashboard"]);
  }

  logout() {
    // this.appStore.dispatch(logoutUser());
    this.router.navigate(["/login"]);
  }
}
