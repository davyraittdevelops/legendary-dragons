import { createReducer, on } from "@ngrx/store";
import {
  loginUser,
  loginUserFail,
  loginUserSuccess,
  logoutUser,
  registerUser,
  registerUserFail,
  registerUserSuccess
} from "./user.actions";
import { UserState } from "./models/user-state.model";
import jwt_decode from "jwt-decode";

const initialState: UserState = {
  isLoading: false,
  hasError: false,
  user: {
    email: "",
    nickname: ""
  }
}

export const userReducer = createReducer(
  initialState,
  on(registerUser, (state) => ({...state, isLoading: true})),
  on(registerUserSuccess, (state) => ({...state, isLoading: false, hasError: false})),
  on(registerUserFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(loginUser, (state) => ({...state, isLoading: true})),
  on(loginUserFail, (state) => ({...state, isLoading: false, hasError: true})),
  on(loginUserSuccess, (state, {jwt}) => {
    const decoded: any = jwt_decode(jwt);
    const newState: UserState = {
      ...state,
      isLoading: false,
      hasError: false,
      user: {
        email: decoded.email,
        nickname: decoded.nickname
      }
    };

    localStorage.setItem('token', jwt);
    return newState;
  }),
  on(logoutUser, () => {
    localStorage.removeItem('token');
    return initialState;
  }),
)
