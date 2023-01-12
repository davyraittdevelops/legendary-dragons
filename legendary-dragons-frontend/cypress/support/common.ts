export const loginUser = () => {
  cy.visit('/login');
  cy.get("input[name=email]").type("oopamxicbrujagrfvi@tmmcv.com");
  cy.get("input[name=password]").type("verySecurePassw0rd!").blur();
  cy.get("form").submit();
}

export const logout = () => {
  cy.get("button[name=logout]").click();
}
