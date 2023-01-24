import {loginUser, logout, removeAllWishlistCards} from "../support/common";

beforeEach(() => {
  loginUser();
  removeAllWishlistCards();
});

afterEach(() => {
  logout();
});

describe('Create and remove a card in wishlist', () => {
  it('passes', () => {
    // Arrange
    cy.get("#mat-tab-label-0-2").click();
    cy.get("button[name=openAddCardModal]").click();
    cy.get("div[role=document]").should("be.visible");

    // Act - Create
    cy.get("input[name=keywordSearch]").type("Swords to plowshares");
    cy.get("input[name=keywordSearch]").type("{enter}");
    cy.get("button[name=addCardToWishlist]").click();
    cy.get("button[aria-label=Close]").click();

    // Assert - Create
    cy.get("div[role=document]").should("not.be.visible");
    cy.get(".card-title", {timeout: 5000}).contains("Main");
    cy.get("button[name=navigateToDeck]").should("be.visible");

    // Act - Delete
    cy.get("button[name=removeDeck]").click();
    cy.wait(1500);

    // Assert - Delete
    cy.get(".card-title", {timeout: 5000}).should("not.exist");
  })
})
