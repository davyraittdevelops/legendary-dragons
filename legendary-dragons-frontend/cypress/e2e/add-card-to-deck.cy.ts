import {
  addCardToInventory,
  createDeck,
  loginUser, logout, removeAllDecks,
  removeAllInventoryCards
} from "../support/common";

beforeEach(() => {
  loginUser();
  removeAllInventoryCards();
  addCardToInventory();
  removeAllDecks();
  createDeck();
})

afterEach(() => {
  logout();
})

// describe("Add 'Swords to Plowshares' to deck 'Main'", () => {
//   it('passes', () => {
//     //arrange
//
//     //act
//
//     //assert
//   });
// });
//
// describe("", () => {
//   it('passes', () => {
//
//   });
// });
