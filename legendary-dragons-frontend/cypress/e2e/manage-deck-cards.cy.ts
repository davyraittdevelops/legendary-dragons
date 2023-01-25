import {
  addCardToInventory,
  createDeck,
  loginUser, logout, removeAllDecks,
  removeAllInventoryCards
} from "../support/common";

beforeEach(() => {
  loginUser();
  removeAllInventoryCards();
  addCardToInventory();
  removeAllDecks();
  createDeck();
})

afterEach(() => {
  logout();
})

describe("Add and remove 'Swords to Plowshares' to/from deck 'Main'", () => {
  it.only('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();

    //act - add
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("select[name=typeLineFilterSelect]").select("Instant");
    cy.get("select[name=colorFilterSelect]").select("White");
    cy.get("button[name=applyFilter]").click();
    cy.get("button[name=addCardToDeck]").click();

    //assert - add
    cy.get("div[aria-label=deck-viewport]").should("be.visible");
    cy.get("div[aria-label=deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=openDeckCardDetailsModal]").click();
    });
    let deckCardDetails = cy.get("div[role=document]");
    deckCardDetails.should("be.visible");
    cy.contains("Swords to Plowshares");

    cy.get("button[aria-label=Close]").click();

    cy.get("p[aria-label=deck-prices]").should("be.visible");
    cy.get("p[aria-label=deck-prices]").within(() => {
      cy.get("span").should("have.length", 6);
      cy.get("span").eq(0).contains("EUR: 1.98");
      cy.get("span").eq(1).contains("EUR FOIL: 0");
      cy.get("span").eq(2).contains("TIX: 0");
      cy.get("span").eq(3).contains("USD: 2.19");
      cy.get("span").eq(4).contains("USD ETCHED: 0");
      cy.get("span").eq(5).contains("USD FOIL: 0");
    });

    //act - remove
    cy.get("div[aria-label=deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=removeCardFromDeck]").click();
    });

    //assert - remove
    cy.get("div[aria-label=deck-viewport").within(() => {
      cy.get("div[aria-label=deck-card]").should("not.exist");
    });

    cy.get("p[aria-label=deck-prices]").should("be.visible");
    cy.get("p[aria-label=deck-prices]").within(() => {
      cy.get("span").should("have.length", 6);
      cy.get("span").eq(0).contains("EUR: 0");
      cy.get("span").eq(1).contains("EUR FOIL: 0");
      cy.get("span").eq(2).contains("TIX: 0");
      cy.get("span").eq(3).contains("USD: 0");
      cy.get("span").eq(4).contains("USD ETCHED: 0");
      cy.get("span").eq(5).contains("USD FOIL: 0");
    });
  });
});

describe("Add and remove 'Swords to Plowshares' to/from side-deck of deck 'Main'", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();

    //act - add
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("typeLineFilterSelect").select("Instant");
    cy.get("colorFilterSelect").select("White");
    cy.get("button[name=applyFilter]").click();
    cy.get("button[name=addCardToSideDeck]").click();

    //assert - add
    cy.get("div[aria-label=side-deck-viewport]").should("be.visible");
    cy.get("div[aria-label=side-deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=openDeckCardDetailsModal]").click();
    });
    let deckCardDetails = cy.get("div[role=document]");
    deckCardDetails.should("be.visible");
    cy.contains("Swords to Plowshares");

    cy.get("button[aria-label=Close]").click();

    cy.get("p[aria-label=deck-prices]").should("be.visible");
    cy.get("p[aria-label=deck-prices]").within(() => {
      cy.get("span").should("have.length", 6);
      cy.get("span").eq(0).contains("EUR: 1.98");
      cy.get("span").eq(1).contains("EUR FOIL: 0");
      cy.get("span").eq(2).contains("TIX: 0");
      cy.get("span").eq(3).contains("USD: 2.19");
      cy.get("span").eq(4).contains("USD ETCHED: 0");
      cy.get("span").eq(5).contains("USD FOIL: 0");
    });

    //act - remove
    cy.get("div[aria-label=side-deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=removeCardFromDeck]").click();
    });

    //assert - remove
    cy.get("div[aria-label=side-deck-viewport").within(() => {
      cy.get("div[aria-label=deck-card]").should("not.exist");
    });

    cy.get("p[aria-label=deck-prices]").should("be.visible");
    cy.get("p[aria-label=deck-prices]").within(() => {
      cy.get("span").should("have.length", 6);
      cy.get("span").eq(0).contains("EUR: 0");
      cy.get("span").eq(1).contains("EUR FOIL: 0");
      cy.get("span").eq(2).contains("TIX: 0");
      cy.get("span").eq(3).contains("USD: 0");
      cy.get("span").eq(4).contains("USD ETCHED: 0");
      cy.get("span").eq(5).contains("USD FOIL: 0");
    });
  });
});

describe("Move deck card from deck to side-deck", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("button[name=addCardToDeck]").click();

    //act
    cy.get("div[aria-label=deck-viewport]").should("be.visible");
    cy.get("div[aria-label=deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=moveDeckCard]").click();
    });

    //assert
    cy.get("div[aria-label=side-deck-viewport").should("be.visible");
    cy.get("div[aria-label=side-deck-viewport").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=removeCardFromDeck]").click();
    });
  });
});

describe("Move deck card from side-deck to deck", () => {
  it('passes', () => {
    //arrange
    cy.get("button[name=navigateToDeck]").click();
    cy.get("button[name=openAddDeckCardModal]").click();
    cy.get("div[role=document]").should("be.visible");
    cy.get("button[name=addCardToSideDeck]").click();

    //act
    cy.get("div[aria-label=side-deck-viewport]").should("be.visible");
    cy.get("div[aria-label=side-deck-viewport]").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=moveDeckCard]").click();
    });

    //assert
    cy.get("div[aria-label=deck-viewport").should("be.visible");
    cy.get("div[aria-label=deck-viewport").within(() => {
      cy.get("div[aria-label=deck-card]").should("exist");
      cy.get("button[name=removeCardFromDeck]").click();
    });
  });
});
