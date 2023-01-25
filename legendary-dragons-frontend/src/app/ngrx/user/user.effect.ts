import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from "src/app/services/user/user.service";
import {
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
    private readonly actions$: Actions,
    private readonly userService: UserService,
  ) { }

  public loginUserEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      switchMap(({email, password}) => {
        return this.userService.loginUser(email, password)
          .pipe(
            map((response) => {
              const jwt = response.headers.get('x-amzn-remapped-authorization')!.replace('Bearer ', '')
              return loginUserSuccess({jwt})
            }),
            catchError(error => {
              return of(loginUserFail({error: true}));
            })
          )
      })
    )
  );

  public registerUserEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      switchMap(({user}) => {
        return this.userService.registerUser(user).pipe(
          map(() => registerUserSuccess()),
          catchError((error) => {
            console.log(error);
            return of(registerUserFail({error: true}))
          })
        )
      })
    )
  );
}
