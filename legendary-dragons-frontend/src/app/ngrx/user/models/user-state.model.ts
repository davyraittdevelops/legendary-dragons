import { User } from "src/app/models/user.model";

export interface UserState {
  isLoading: boolean;
  hasError: boolean;
  user: User;
}
