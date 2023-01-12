import { CardState } from "./ngrx/card/models/card-state.model";
import { UserState } from "./ngrx/user/models/user-state.model";

export interface AppState {
  readonly user: UserState;
  readonly card: CardState;
}
