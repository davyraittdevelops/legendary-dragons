import {createWishlistCard, loginUser, logout, removeAllWishlistCards} from "../support/common";

beforeEach(() => {
  loginUser();
  removeAllWishlistCards();
  createWishlistCard();
});

afterEach(() => {
  logout();
});

describe('Create and remove a card availability alert', () => {
  it('passes', () => {
    // Arrange
    cy.get("#mat-tab-label-0-2").click();
    cy.get("button[name=detailWishlistItem]").click();
    cy.get("div[role=document]").should("be.visible");

    // Act - Create
    cy.get("#mat-select-0").click();
    cy.get("#mat-option-1").click();
    cy.get("button[name=addAlertButton]").click();

    // Assert - Create
    cy.get("div > ul").should("be.visible");
    cy.get("div > ul").within(() =>{
      cy.get("li").contains("Availability alert");
    });

    // Act - Delete
    cy.get("button[name=alert-0-remove-btn]").click();
    cy.wait(1500);

    // Assert - Delete
    cy.get("div > ul").should("not.exist")
    
    cy.get("button[aria-label=Close]").click();
  })
})