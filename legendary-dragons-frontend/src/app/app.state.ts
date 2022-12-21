import { UserState } from "./ngrx/user/models/user-state.model";

export interface AppState {
  readonly userState: UserState;
}
