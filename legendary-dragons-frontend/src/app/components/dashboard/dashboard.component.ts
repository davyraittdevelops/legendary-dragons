import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import { Router } from "@angular/router";
import { UserService } from "../../services/user/user.service";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private appStore: Store<AppState>, private router: Router, private userService: UserService) { }
  
  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
