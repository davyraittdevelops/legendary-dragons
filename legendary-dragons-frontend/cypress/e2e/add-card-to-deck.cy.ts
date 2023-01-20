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
    cy.get("button[name=navigateToDeckDetails]").click();
    //act
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("button[name=addCardToDeck]").click();
    cy.get("button[aria-label=Close]").click();
    cy.reload(); // TODO: Remove if deck cards are displayed after adding
    cy.wait(3000);
    //assert
    cy.get("div[aria-label=deck-card]").should("be.visible");
    cy.get("button[name=openDeckCardDetailsModal]").click();
    let deckCardDetails = cy.get("div[role=document]")
    deckCardDetails.should("be.visible");
    deckCardDetails.contains("Swords to Plowshares");
    deckCardDetails.contains("Rarity: Uncommon");
    deckCardDetails.contains("Quality: Excellent");
    deckCardDetails.contains("Colors: W");

    cy.get("button[aria-label=Close]").click();
  });
});
