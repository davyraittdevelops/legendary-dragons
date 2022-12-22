import { createAction, props } from '@ngrx/store'
import { UserModel } from 'src/app/models/user.model';

export const registerUser = createAction(
  '[Login Page Component] Register',
  props<{ user: UserModel }>()
);

export const registerUserFail = createAction(
  '[Login Page Component] Register Fail',
  props<{ error: boolean }>(),
)

export const registerUserSuccess = createAction(
  '[Login Page Component] Register Success',
  props<{ user: UserModel }>()
)

export const logoutUser = createAction(
  '[Navbar Component] Logout'
);

export const loginUser = createAction(
  '[Login Page Component] Login',
  props<{ user: UserModel }>()
)

export const getUserByEmail = createAction(
  '[Board Permission Page Component] Get User By Email',
  props<{ email: string }>()
)

export const getUserByEmailFail = createAction(
  '[Board Permission Page Component] Get User By Email Fail',
  props<{ error: boolean }>()
)

export const getUserByEmailSuccess = createAction(
  '[Board Permission Page Component] Get User By Email Success',
  props<{ user: UserModel }>()
)

export const loginUserFail = createAction(
  '[Login Page Component] Login Fail',
  props<{ error: boolean }>(),
)

export const loginUserSuccess = createAction(
  '[Login Page Component] Login Success',
  props<{ user: UserModel }>()
)
