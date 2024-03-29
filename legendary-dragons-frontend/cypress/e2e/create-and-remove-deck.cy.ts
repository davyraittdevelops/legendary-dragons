import {loginUser, logout, removeAllDecks} from "../support/common";

beforeEach(() => {
  loginUser();
  removeAllDecks();
});

afterEach(() => {
  logout();
});

describe('Create and remove a deck', () => {
  it('passes', () => {
    // Arrange
    cy.get("#mat-tab-label-0-1").click();
    cy.get("button[name=openCreateDeckModal]").click();
    cy.get("div[role=document]").should("be.visible");
    let nameInput = cy.get("input[name=name]");
    let typeInput = cy.get("input[name=decktype]");

    // Act - Create
    nameInput.type("Main");
    typeInput.type("EDH/Commander");
    cy.get("button[name=createDeck]").click();

    // Assert - Create
    cy.get("div[role=document]").should("not.be.visible");
    cy.get(".card-title").contains("Main");
    cy.get("button[name=navigateToDeck]").should("be.visible");

    // Act - Delete
    cy.get("button[name=removeDeck]").click();
    cy.wait(1500);

    // Assert - Delete
    cy.get(".card-title").should("not.exist");
  })
})
