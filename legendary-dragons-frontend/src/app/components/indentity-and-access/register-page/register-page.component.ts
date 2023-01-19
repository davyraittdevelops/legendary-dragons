import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs';
import { UserRegistration } from 'src/app/models/user.model';
import { registerUser } from 'src/app/ngrx/user/user.actions';
import { isLoadingSelector, userErrorSelector } from 'src/app/ngrx/user/user.selectors';
import { AppState } from "../../../app.state";

export const validatePasswords = (control: AbstractControl): ValidationErrors | null => {
  if (control && control.get("password") && control.get("confirmPassword")) {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    if (!password || !confirmPassword) {
      return null
    }
    return (password != confirmPassword) ? { passwordsNotEqual: true } : null
  }
  return null;
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>

  form = new FormGroup({
    name: new FormControl(
      '', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]
    ),
    email: new FormControl(
      '', [Validators.required, Validators.email]
    ),
    password: new FormControl(
      '', [Validators.required, Validators.minLength(10), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{10,}/)]
    ),
    confirmPassword: new FormControl(
      '', [Validators.required]
    ),
  }, {validators: validatePasswords, updateOn: "blur"})

  constructor(private router: Router, private appStore: Store<AppState>) {
    this.isLoading$ = this.appStore.select(isLoadingSelector);
    this.hasError$ = this.appStore.select(userErrorSelector);
  }

  ngOnInit(): void {
  }

  registerUser() {
    if (this.form.invalid) {
      return;
    }

    const user: UserRegistration = {
      nickname: this.name.value!,
      email: this.email.value!,
      password: this.password.value!
    }

    this.appStore.dispatch(registerUser({user}))

    this.appStore.select('user').subscribe({
      next: (state) => {
        if (!state.hasError && !state.isLoading)
          this.router.navigate(["/login"])
      }
    })
  }

  get name() {
    return this.form.controls?.['name'];
  }

  get email() {
    return this.form.controls?.['email'];
  }

  get password() {
    return this.form.controls?.['password'];
  }

  get confirmPassword() {
    return this.form.controls?.['confirmPassword'];
  }
}
