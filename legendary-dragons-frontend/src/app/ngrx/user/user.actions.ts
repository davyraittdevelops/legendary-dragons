import { createAction, props } from '@ngrx/store';
import { UserRegistration } from 'src/app/models/user.model';

export const registerUser = createAction(
  '[Register Page Component] Register',
  props<{ user: UserRegistration }>()
);

export const registerUserFail = createAction(
  '[Register Page Component] Register Fail',
  props<{ error: boolean }>(),
)

export const registerUserSuccess = createAction(
  '[Register Page Component] Register Success'
)

export const logoutUser = createAction(
  '[Navbar Component] Logout'
);

export const loginUser = createAction(
  '[Login Page Component] Login',
  props<{ email: string, password: string }>()
)

export const loginUserFail = createAction(
  '[Login Page Component] Login Fail',
  props<{ error: boolean }>(),
)

export const loginUserSuccess = createAction(
  '[Login Page Component] Login Success',
  props<{ jwt: string }>()
)
