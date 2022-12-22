import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { UserService } from 'src/app/services/user/user.service';
import { AppState } from "../../app.state";

export const validatePasswords = (control: AbstractControl): ValidationErrors | null => {
  if (control && control.get("password") && control.get("confirmpassword")) {
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
  registrationError = false;

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

  constructor(private router: Router, private appStore: Store<AppState>, private userService: UserService) {}

  ngOnInit(): void {
  }

  registerUser() {
    if (this.form.invalid) {
      return;
    }

    const user = {
      nickname: this.name.value!,
      email: this.email.value!,
      password: this.password.value!
    }

    this.userService.registerUser(user).subscribe({
      next: () => {
        this.registrationError = false;
        this.router.navigate(["/login"])
      },
      error: () => {
        this.registrationError = true;
      }
    });
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
