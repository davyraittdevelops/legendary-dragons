import {loginUser, logout, removeAllWishlistCards, createWishlistCard} from "../support/common";

beforeEach(() => {
  loginUser();
  removeAllWishlistCards();
  createWishlistCard();
});

afterEach(() => {
  logout();
});

//TODO: add a remove all wishlistalerts!
describe('Create and remove a card price alert', () => {
  it('passes', () => {
    // Arrange
    cy.get("button[name=detailWishlistItem]").click();
    cy.get("div[role=document]").should("be.visible");

    // Act - Create
    cy.get("#mat-select-0").click();
    cy.get("#mat-option-0").click();
    cy.get("input[name=pricePointInput]").type("20");
    cy.get("button[name=addAlertButton]").click();

    // Assert - Create
    cy.get("div > ul").should("be.visible");
    cy.get("div > ul").within(() =>{
      cy.get("li").contains("Price alert");
    });

    // Act - Delete
    cy.get("button[name=alert-0-remove-btn]").click();
    cy.wait(1500);

    // Assert - Delete
    cy.get("div > ul").should("not.exist")
    
    cy.get("button[aria-label=Close]").click();
  })
})