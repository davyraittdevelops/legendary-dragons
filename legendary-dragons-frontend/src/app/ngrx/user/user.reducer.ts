import { createReducer, on } from "@ngrx/store";
import {
  // loginUser,
  // loginUserFail,
  // loginUserSuccess,
  // logoutUser,
  registerUser,
  registerUserFail,
  registerUserSuccess
} from "./user.actions";
import { UserState } from "./models/user-state.model";

const initialState: UserState = {
  isLoading: false,
  hasError: false,
  // hasUserError: false,
  // isRegisterUserLoading: false,
  // hasRegisterUserError: false,
  // user: {
  //   email: "",
  //   nickname: ""
  // }
}

export const userReducer = createReducer(
  initialState,
  on(registerUser, (state, {user}) => ({...state, isLoading: true})),
  on(registerUserSuccess, (state) => ({...state, isLoading: false, hasError: false})),
  on(registerUserFail, (state) => ({...state, isLoading: false, hasError: true}))

)
//   on(loginUser, (state, {user}) => {
//     const newState: UserState = {
//       ...state,
//       user: user,
//       isLoading: true,
//       hasUserError: false
//     };

//     return newState;
//   }),

//   on(loginUserSuccess, (state, {user}) => {
//     const newState: UserState = {
//       ...state,
//       user: user,
//       isLoading: false,
//       hasUserError: false
//     };

//     return newState;
//   }),

//   on(loginUserFail, (state) => {
//     const newState: UserState = {
//       ...state,
//       isLoading: false,
//       hasUserError: true
//     };

//     return newState;
//   }),

//   on(logoutUser, () => {
//     return initialState;
//   }),
// )
