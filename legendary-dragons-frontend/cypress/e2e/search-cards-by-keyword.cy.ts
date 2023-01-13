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
    cy.get("table > tbody", {timeout: 5000}).should("be.visible");
    cy.get("table > tbody").within(() => {
      cy.get("tr").should("have.length", 2);
      cy.get("tr").eq(0).find("td").eq(0).contains("Conclave Mentor");
      cy.get("tr").eq(0).find("td").eq(1).contains("2022-07-08");
      cy.get("tr").eq(0).find("td").eq(2).contains("Masters");
      cy.get("tr").eq(1).find("td").eq(0).contains("Conclave Mentor");
      cy.get("tr").eq(1).find("td").eq(1).contains("2020-07-03");
      cy.get("tr").eq(1).find("td").eq(2).contains("Core");
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
    cy.get("table > tbody").should("not.be.visible");
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
      cy.get("tr").eq(0).find("td").eq(1).contains("2020-09-25");
      cy.get("tr").eq(0).find("td").eq(2).contains("Expansion");
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
      cy.get("tr").eq(0).find("td").eq(1).contains("2020-09-25");
      cy.get("tr").eq(0).find("td").eq(2).contains("Expansion");
      cy.get("tr").eq(0).find("td").eq(3).contains("Uncommon");
    });
  })
});
