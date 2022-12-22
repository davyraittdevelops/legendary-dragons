import { User } from "src/app/models/user.model";

export interface UserState {
  isUserLoading: boolean;
  hasUserError: boolean;
  isRegisterUserLoading: boolean;
  hasRegisterUserError: boolean;
  user: User;
}
