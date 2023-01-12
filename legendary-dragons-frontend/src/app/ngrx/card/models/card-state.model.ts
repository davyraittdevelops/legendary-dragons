import { Card } from "src/app/models/card.model";

export interface CardState {
  isLoading: boolean;
  hasError: boolean;
  searchedCards: Card[];
}
