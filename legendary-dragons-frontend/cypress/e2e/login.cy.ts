describe('Login user', () => {
  it('passes', () => {
    //arrange
    cy.visit("/login");
    let emailInput = cy.get("input[name=email]");
    let passwordInput = cy.get("input[name=password]");
    let loginForm = cy.get("form");

    //act
    emailInput.type("yonefi8791@quamox.com");
    passwordInput.type("verySecurePassw0rd!").blur();
    loginForm.submit();

    //assert
    cy.get("input[name=email]").should('contain.value', "yonefi8791@quamox.com");
    cy.get("input[name=password]").should('contain.value', "verySecurePassw0rd!");
    cy.location('pathname').should('eq', '/dashboard');
  });
});

describe('Login user with incorrect password', () => {
  it('passes', () => {
    //arrange
    cy.visit("/login");
    let emailInput = cy.get("input[name=email]");
    let passwordInput = cy.get("input[name=password]");
    let loginForm = cy.get("form");

    //act
    emailInput.type("yonefi8791@quamox.com");
    passwordInput.type("incorrectPassword").blur();
    loginForm.submit();

    //assert
    cy.get("input[name=email]").should('contain.value', "yonefi8791@quamox.com");
    cy.get("input[name=password]").should('contain.value', "incorrectPassword");

    cy.get("form").should("contain.text", "Incorrect email/password provided.");
  });
});
