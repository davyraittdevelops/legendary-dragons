import { createAction, props } from '@ngrx/store';
import { User, UserRegistration } from 'src/app/models/user.model';

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

// export const loginUser = createAction(
//   '[Login Page Component] Login',
//   props<{ user: User }>()
// )

// export const getUserByEmail = createAction(
//   '[Board Permission Page Component] Get User By Email',
//   props<{ email: string }>()
// )

// export const getUserByEmailFail = createAction(
//   '[Board Permission Page Component] Get User By Email Fail',
//   props<{ error: boolean }>()
// )

// export const getUserByEmailSuccess = createAction(
//   '[Board Permission Page Component] Get User By Email Success',
//   props<{ user: User }>()
// )

// export const loginUserFail = createAction(
//   '[Login Page Component] Login Fail',
//   props<{ error: boolean }>(),
// )

// export const loginUserSuccess = createAction(
//   '[Login Page Component] Login Success',
//   props<{ user: User }>()
// )
