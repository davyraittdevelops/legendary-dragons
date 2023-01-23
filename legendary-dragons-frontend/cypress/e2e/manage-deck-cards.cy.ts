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
    cy.wait(2000);

    //assert
    cy.get("div[aria-label=deck-viewport]").should("be.visible");
    cy.get("div[aria-label=deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=openDeckCardDetailsModal]").click();
    });
    let deckCardDetails = cy.get("div[role=document]");
    deckCardDetails.should("be.visible");
    cy.contains("Swords to Plowshares");

    cy.get("button[aria-label=Close]").click();
  });
});

describe("Add 'Swords to Plowshares' to side-deck of deck 'Main'", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();

    //act
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("button[name=addCardToSideDeck]").click();
    cy.wait(2000);

    //assert
    cy.get("div[aria-label=side-deck-viewport]").should("be.visible");
    cy.get("div[aria-label=side-deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=openDeckCardDetailsModal]").click();
    });
    let deckCardDetails = cy.get("div[role=document]");
    deckCardDetails.should("be.visible");
    cy.contains("Swords to Plowshares");

    cy.get("button[aria-label=Close]").click();
  });
});

describe("Remove 'Swords to Plowshares' from deck 'Main'", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("button[name=addCardToDeck]").click();
    cy.wait(2000);

    //act
    cy.get("div[aria-label=deck-viewport]").should("be.visible");
    cy.get("div[aria-label=deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=removeCardFromDeck]").click();
    });

    //assert
    cy.get("div[aria-label=deck-viewport").should("be.visible");
    cy.get("div[aria-label=deck-viewport").within(() => {
      cy.get("div[aria-label=deck-card]").should("not.exist");
    });
  });
});

describe("Remove 'Swords to Plowshares' from the side-deck of deck 'Main'", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("button[name=addCardToSideDeck]").click();
    cy.wait(2000);

    //act
    cy.get("div[aria-label=side-deck-viewport]").should("be.visible");
    cy.get("div[aria-label=side-deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=removeCardFromDeck]").click();
    });

    //assert
    cy.get("div[aria-label=side-deck-viewport").should("be.visible");
    cy.get("div[aria-label=side-deck-viewport").within(() => {
      cy.get("div[aria-label=deck-card]").should("not.exist");
    });
  });
});
