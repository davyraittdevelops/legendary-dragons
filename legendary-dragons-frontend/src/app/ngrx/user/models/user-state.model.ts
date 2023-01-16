import { User } from "src/app/models/user.model";

export interface UserState {
  isLoading: boolean;
  hasError: boolean;
  isLoggedIn: boolean;
  user: User;
}
