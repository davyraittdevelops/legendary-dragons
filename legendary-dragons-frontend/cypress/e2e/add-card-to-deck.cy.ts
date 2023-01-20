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

describe("Add 'Swords to Plowshares' to deck 'Main'", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();
    //act
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("button[name=addCardToDeck]").click();
    cy.get("button[aria-label=Close]").click();
    cy.wait(3000);
    //assert
    // cy.get("1 cards").should("be.visible");
    cy.get("div[aria-label=deck-viewport]").should("be.visible");
    cy.get("div[aria-label=deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=openDeckCardDetailsModal]").click();
    });
    let deckCardDetails = cy.get("div[role=document]")
    deckCardDetails.should("be.visible");
    cy.contains("Swords to Plowshares");

    cy.get("button[aria-label=Close]").click();
  });
});
