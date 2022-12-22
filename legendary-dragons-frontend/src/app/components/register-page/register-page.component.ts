import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";

export const validatePasswords = (control: AbstractControl): ValidationErrors | null => {
  if (control && control.get("password") && control.get("confirmpassword")) {
    console.log(control)
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmpassword")?.value;
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
  registerFail = false;
  registerSuccess = false;

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
    confirmpassword: new FormControl(
      '', [Validators.required]
    )
  }, {validators: validatePasswords, updateOn: "blur"})

  constructor(private router: Router, private appStore: Store<AppState>) { }

  ngOnInit(): void {
  }

  registerUser() {
    console.log(this.form)
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

  get name() {
    return this.form.controls?.['name'];
  }

  get email() {
    return this.form.controls?.['email'];
  }

  get password() {
    return this.form.controls?.['password'];
  }

  get confirmpassword() {
    return this.form.controls?.['confirmpassword'];
  }
}
