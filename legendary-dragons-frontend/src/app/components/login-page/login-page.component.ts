import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AppState } from "../../app.state";
import { Store } from "@ngrx/store";
import { loginUser } from "../../ngrx/user/user.actions";
import { UserState } from "../../ngrx/user/models/user-state.model";
import { UserService } from "../../services/user/user.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  userSubscription: Subscription | undefined;
  loginFailed = false;
  loginSuccess = false;

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private router: Router, private appStore: Store<AppState>, private userService: UserService) { }

  ngOnInit(): void {
  }

  login() {
    // if (!this.form.valid) {
    //   this.loginFailed = true;
    //   return;
    // }
    //
    // this.appStore.dispatch(loginUser({user: {email: this.form.get("email")?.getRawValue(), password: this.form.get("password")?.getRawValue(), name: ""}}));
    //
    // this.userService = this.appStore
    //   .select('userState')
    //   .subscribe((state: UserState) => {
    //     this.loginFailed = true;
    //
    //     if (!state.hasUserError && !state.isUserLoading) {
    //       this.loginFailed = false;
    //       this.loginSuccess = true;
    //       this.userService.setUsername(state.user.name);
    //       this.userService.setUserEmail(state.user.email);
    //
    //       setTimeout(() => {
    //         this.router.navigate(["/dashboard"]);
    //       }, 2000);
    //     }
    //   });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
