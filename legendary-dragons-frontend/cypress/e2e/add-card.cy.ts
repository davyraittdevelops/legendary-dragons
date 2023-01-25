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
    let collectionCard = cy.get("div[aria-label=collection-card]");
    collectionCard.should('be.visible');
    collectionCard.eq(0).click();
    let cardDetails = cy.get("div[role=document]");
    cardDetails.should("be.visible");
    cardDetails.contains("Swords to Plowshares");
    cy.get("button[aria-label=Close]").click();

    cy.get("P[aria-label=inventory-prices]").should("be.visible");
    cy.get("p[aria-label=inventory-prices]").within(() => {
      cy.get("span").should("have.length", 6);
      cy.get("span").eq(0).contains("EUR: 1.98");
      cy.get("span").eq(1).contains("EUR FOIL: 0");
      cy.get("span").eq(2).contains("TIX: 0");
      cy.get("span").eq(3).contains("USD: 2.19");
      cy.get("span").eq(4).contains("USD ETCHED: 0");
      cy.get("span").eq(5).contains("USD FOIL: 0");
    });

    //act - delete
    cy.get("li[id=card-remove-btn]").click();
    //assert - delete
    cy.wait(2000);
    cy.get("div[aria-label=collection-card]").should("not.exist");
  });
});
