export const loginUser = () => {
  cy.visit("/login");
  cy.get("input[name=email]").type("ajdjbxombnywmxvkxu@tmmcv.com");
  cy.get("input[name=password]").type("verySecurePassw0rd!").blur();
  cy.get("form").submit();
  cy.url().should("contain", "/dashboard");
}

export const logout = () => {
  cy.get("button[name=logout]").click();
}

export const removeAllInventoryCards = () => {
  cy.wait(3000);
  cy.get("body").then($body => {
    if ($body.find("div[aria-label=collection-card]").length > 0) {
      cy.get("button[name=removeCardFromInventory]").click({multiple: true});
    }
  });
  cy.get("div[aria-label=collection-card]").should("not.exist");
}

export const addCardToInventory = () => {
  cy.visit("/dashboard");
  cy.get("button[name=openAddCardModal]").click();
  cy.get("div[role=document]").should("be.visible");
  cy.get("input[name=keywordSearch]").type("Swords to plowshares");
  cy.get("input[name=keywordSearch]").type("{enter}");
  cy.get("#mat-select-0").click();
  cy.get("#mat-option-0").click();
  cy.get("button[name=addCardToInventory]").eq(0).click();
  cy.get("button[aria-label=Close]").click();
}

export const removeAllDecks = () => {
  cy.visit("/dashboard");
  cy.get("#mat-tab-label-0-1").click();
  cy.wait(3000);
  cy.get("body").then($body => {
    if ($body.find("div[aria-label=deck]").length > 0) {
      cy.get("button[name=removeDeck]").click({multiple: true});
    }
  });
  cy.get("div[aria-label=deck]").should("not.exist");
}

export const createDeck = () => {
  cy.visit("/dashboard");
  cy.get("#mat-tab-label-0-1").click();
  cy.get("button[name=openCreateDeckModal]").click();
  cy.get("div[role=document]").should("be.visible");
  cy.get("input[name=name]").type("Main");
  cy.get("input[name=decktype]").type("EDH/Commander");
  cy.get("button[name=createDeck]").click();
}
