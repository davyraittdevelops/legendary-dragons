import { createReducer, on } from "@ngrx/store";
import {
  getUserByEmail,
  getUserByEmailFail,
  getUserByEmailSuccess,
  loginUser,
  loginUserFail,
  loginUserSuccess,
  logoutUser,
  registerUser,
  registerUserFail,
  registerUserSuccess
} from "./user.actions";
import { UserState } from "./models/user-state.model";

const initialState: UserState = {
  isUserLoading: false,
  hasUserError: false,
  isRegisterUserLoading: false,
  hasRegisterUserError: false,
  user: {
    email: "",
    name: ""
  }
}

export const userReducer = createReducer(
  initialState,

  on(getUserByEmail, (state, {email}) => {
    // Check if this works
    
    const newState: UserState = {
      ...state,
      user: {
        email: email,
        name: ""
      },
      isUserLoading: true,
      hasUserError: false
    };

    return newState;
  }),

  on(getUserByEmailFail, (state) => {
    const newState: UserState = {
      ...state,

      isUserLoading: false,
      hasUserError: true
    };

    return newState;
  }),

  on(getUserByEmailSuccess, (state, {user}) => {
    const newState: UserState = {
      ...state,
      
      
      user: user,
      isUserLoading: false,
      hasUserError: false
    };

    return newState;
  }),

  on(registerUser, (state, {user}) => {
    const newState: UserState = {
      ...state,
      isRegisterUserLoading: true,
      hasRegisterUserError: false,
      user: user
    };

    return newState;
  }),

  on(registerUserSuccess, (state, {user}) => {
    const newState: UserState = {
      ...state,
      user: user,
      isRegisterUserLoading: false,
      hasRegisterUserError: false,
    };

    return newState;
  }),

  on(registerUserFail, (state) => {
    const newState: UserState = {
      ...state,
      isRegisterUserLoading: false,
      hasRegisterUserError: true,
    };

    return newState;
  }),

  on(loginUser, (state, {user}) => {
    const newState: UserState = {
      ...state,
      user: user,
      isUserLoading: true,
      hasUserError: false
    };

    return newState;
  }),

  on(loginUserSuccess, (state, {user}) => {
    const newState: UserState = {
      ...state,
      user: user,
      isUserLoading: false,
      hasUserError: false
    };

    return newState;
  }),

  on(loginUserFail, (state) => {
    const newState: UserState = {
      ...state,
      isUserLoading: false,
      hasUserError: true
    };

    return newState;
  }),

  on(logoutUser, () => {
    return initialState;
  }),
)
