import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { UserService } from "src/app/services/user/user.service";
import { AppState } from "../../app.state";

import {
  getUserByEmail,
  getUserByEmailFail,
  getUserByEmailSuccess,
  loginUser,
  loginUserFail,
  loginUserSuccess,
  registerUser,
  registerUserFail,
  registerUserSuccess
} from "./user.actions";

@Injectable()
export class UserEffects {

  constructor(
    private readonly appStore: Store<AppState>,
    private readonly actions: Actions,
    private readonly userService: UserService,
  ) { }

  public getUserByEmailEffect = createEffect(() =>
    this.actions.pipe(
      ofType(getUserByEmail),
      withLatestFrom(this.appStore.select('userState')),
      mergeMap(([payload, state]) => this.userService.getUserById(payload.email)
        .pipe(
          map(user => {
            return ({
              type: getUserByEmailSuccess.type,
              user: user
            });
          }),
          catchError(error => {
            return of({ type: getUserByEmailFail.type, error: error });
          })
        ))
    )
  );

  public loginUserEffect = createEffect(() =>
    this.actions.pipe(
      ofType(loginUser),
      withLatestFrom(this.appStore.select('userState')),
      mergeMap(([payload, state]) => this.userService.loginUser(payload.user)
        .pipe(
          map(user => {
            return ({
              type: loginUserSuccess.type,
              user: user
            });
          }),
          catchError(error => {
            return of({ type: loginUserFail.type, error: error });
          })
        ))
    )
  );

  public registerUserEffect = createEffect(() =>
    this.actions.pipe(
      ofType(registerUser),
      withLatestFrom(this.appStore.select('userState')),
      mergeMap(([payload, state]) => this.userService.registerUser(payload.user)
        .pipe(
          map(user => {
            return ({
              type: registerUserSuccess.type,
              user: user
            });
          }),
          catchError(error => {
            return of({ type: registerUserFail.type, error: error });
          })
        ))
    )
  );
}
