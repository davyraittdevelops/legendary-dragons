import {loginUser, logout, removeAllInventoryCards} from "../support/common";

beforeEach(() => {
  loginUser();
  removeAllInventoryCards();
});

afterEach(() => {
  logout();
});

describe("Search, add and delete 'Swords to plowshares' to/from the inventory", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=openAddCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    let keywordSearchInput = cy.get("input[name=keywordSearch]");

    //act - add
    keywordSearchInput.type("Swords to plowshares");
    keywordSearchInput.type("{enter}");
    cy.get("#mat-select-0").click();
    cy.get("#mat-option-0").click();
    cy.get("button[name=addCardToInventory]").eq(0).click();
    cy.get("button[aria-label=Close]").click();
    //assert - add
    let collectionCard = cy.get("div[aria-label=collection-card]", {timeout: 5000})
    collectionCard.should('be.visible');
    collectionCard.eq(0).click();
    let cardDetails = cy.get("div[role=document]")
    cardDetails.should("be.visible");
    cardDetails.contains("Swords to Plowshares");
    cy.get("button[aria-label=Close]").click();

    //act - delete
    cy.get("button[name=removeCardFromInventory]").click()
    //assert - delete
    cy.wait(2000);
    cy.get("div[aria-label=collection-card]", {timeout: 5000}).should("not.exist");
  });
});
