import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  userSubscription: Subscription | undefined;

  registerFail = false;
  registerSuccess = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(75)]),
    email: new FormControl('', [Validators.required, Validators.pattern("[^ @]@[^ @]")]),
    password: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
    confirmpassword: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)])
  })

  constructor(private router: Router, private appStore: Store<AppState>) { }

  ngOnInit(): void {
  }

  registerUser() {
    console.log("register")
    // if (!this.form.valid) {
    //   this.registerFail = true;
    //   return;
    // }
    //
    // this.appStore.dispatch(registerAccount({account: {email: this.form.get("email")?.getRawValue(), password: this.form.get("password")?.getRawValue(), name: this.form.get("name")?.getRawValue()}}));
    //
    // this.accountSubscription = this.appStore
    //   .select('accountState')
    //   .subscribe((state: AccountState) => {
    //     this.registerFail = true;
    //
    //     if (!state.hasRegisterAccountError && !state.isRegisterAccountLoading) {
    //       this.registerFail = false;
    //       this.registerSuccess = true;
    //
    //       setTimeout(() => {
    //         this.router.navigate(["/login"]);
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
