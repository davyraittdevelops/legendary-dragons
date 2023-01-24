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
    cy.get("button[name=addCardToWishlist]").eq(0).click();
    cy.get("button[aria-label=Close]").click();

    // Assert - Create
    let wishlistCard = cy.get("div[aria-label=wishlist-card]", {timeout: 5000});
    wishlistCard.should('be.visible');
    wishlistCard.eq(0).click();
    let cardDetails = cy.get("div[role=document]");
    cardDetails.should("be.visible");
    cardDetails.contains("Swords to Plowshares");
    cy.get("button[aria-label=Close]").click();

    // Act - Delete
    cy.get("button[name=removeWishlistItem]").click();
    cy.wait(1500);

    // Assert - Delete
    cy.get("div[aria-label=wishlist-card]", {timeout: 5000}).should("not.exist");
  })
})
