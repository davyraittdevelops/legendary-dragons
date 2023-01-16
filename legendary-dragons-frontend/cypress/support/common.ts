export const loginUser = () => {
  cy.visit('/login');
  cy.get("input[name=email]").type("ajdjbxombnywmxvkxu@tmmcv.com");
  cy.get("input[name=password]").type("verySecurePassw0rd!").blur();
  cy.get("form").submit();
  cy.url().should('contain', '/dashboard');
}

export const logout = () => {
  cy.get("button[name=logout]").click();
}

export const removeAllInventoryCards = () => {
  cy.wait(2000);
  cy.get("body").then($body => {
    if ($body.find("div[aria-label=collection-card]").length > 0) {
      cy.get("button[name=removeCardFromInventory]").click({multiple: true});
    }
  });
  cy.get("div[aria-label=collection-card]").should('not.exist');
}
