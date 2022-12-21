import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import { UserState } from "../../ngrx/user/models/user-state.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSubscription: Subscription | undefined;
  userName: string | undefined

  constructor(private appStore: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.appStore
      .select('userState')
      .subscribe((state: UserState) => {

        if (!state.hasUserError && !state.isUserLoading) {
          this.userName = state.user.name;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
