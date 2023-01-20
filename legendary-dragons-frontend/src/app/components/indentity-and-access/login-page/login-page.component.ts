import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app.state";
import { Observable } from 'rxjs';
import { isLoadingSelector, userErrorSelector } from 'src/app/ngrx/user/user.selectors';
import { loginUser } from 'src/app/ngrx/user/user.actions';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private router: Router, private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(userErrorSelector);
  }

  ngOnInit(): void {}

  login() {
    if (this.form.invalid) {
      return;
    }

    const user = {
      email: this.form.controls?.["email"].value!,
      password: this.form.controls?.["password"].value!
    }

    this.appStore.dispatch(loginUser({email: user.email, password: user.password}));
    this.appStore.select('user').subscribe({
      next: (state) => {
        if (!state.hasError && !state.isLoading)
          this.router.navigate(["/dashboard"])
      }
    })
  }

}
