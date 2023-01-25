import {loginUser, logout} from "../support/common";

beforeEach(() => {
  loginUser();
});

afterEach(() => {
  cy.get("button[aria-label=Close]").click();
  logout();
});

describe("Search 'Conclave Mentor' card", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=openAddCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    let keywordSearchInput = cy.get("input[name=keywordSearch]");
    //act
    keywordSearchInput.type("Conclave mentor");
    keywordSearchInput.type("{enter}");

    //assert
    cy.get("table > tbody").should("be.visible");
    cy.get("table > tbody").within(() => {
      cy.get("tr").should("have.length", 2);
      cy.get("tr").eq(0).find("td").eq(0).contains("Conclave Mentor");
      cy.get("tr").eq(0).find("td").eq(1).contains("Double Masters 2022");
      cy.get("tr").eq(0).find("td").eq(2).contains("08/07/2022");
      cy.get("tr").eq(0).find("td").eq(3).contains("Uncommon");
      cy.get("tr").eq(1).find("td").eq(0).contains("Conclave Mentor");
      cy.get("tr").eq(1).find("td").eq(1).contains("Core Set 2021");
      cy.get("tr").eq(1).find("td").eq(2).contains("03/07/2020");
      cy.get("tr").eq(1).find("td").eq(3).contains("Uncommon");
    });
  })
});

describe("Searching gibberish results in no found cards", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=openAddCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    let keywordSearchInput = cy.get("input[name=keywordSearch]");
    //act
    keywordSearchInput.type("abcdefghijklmnopqrstuvwxyz");
    keywordSearchInput.type("{enter}");
    //assert
    cy.get("div[role=document]").should("not.contain", "table");
  })
});

describe("Searching twice refines search results", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=openAddCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    let keywordSearchInput = cy.get("input[name=keywordSearch]");
    //act
    keywordSearchInput.type("dog");
    keywordSearchInput.type("{enter}");
    cy.get("table > tbody").within(() => {
      cy.get("tr").should("have.length", 53);
    });
    keywordSearchInput.type("pile");
    keywordSearchInput.type("{enter}");
    //assert
    cy.get("table > tbody").should("be.visible");
    cy.get("table > tbody").within(() => {
      cy.get("tr").should("have.length", 1);
    });
  })
});

describe("Search both names of two sided card 'Spikefield Hazard // Spikefield Cave'", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=openAddCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    let keywordSearchInput = cy.get("input[name=keywordSearch]");
    //act
    keywordSearchInput.type("Spikefield hazard");
    keywordSearchInput.type("{enter}");
    //assert
    cy.get("table > tbody").should("be.visible");
    cy.get("table > tbody").within(() => {
      cy.get("tr").should("have.length", 1);
      cy.get("tr").eq(0).find("td").eq(0).contains("Spikefield Hazard // Spikefield Cave");
      cy.get("tr").eq(0).find("td").eq(1).contains("Zendikar Rising");
      cy.get("tr").eq(0).find("td").eq(2).contains("25/09/2020");
      cy.get("tr").eq(0).find("td").eq(3).contains("Uncommon");
    });
    //act
    keywordSearchInput.clear();
    keywordSearchInput.type("Spikefield cave");
    keywordSearchInput.type("{enter}");
    //assert
    cy.get("table > tbody").should("be.visible");
    cy.get("table > tbody").within(() => {
      cy.get("tr").should("have.length", 1);
      cy.get("tr").eq(0).find("td").eq(0).contains("Spikefield Hazard // Spikefield Cave");
      cy.get("tr").eq(0).find("td").eq(1).contains("Zendikar Rising");
      cy.get("tr").eq(0).find("td").eq(2).contains("25/09/2020");
      cy.get("tr").eq(0).find("td").eq(3).contains("Uncommon");
    });
  })
});
