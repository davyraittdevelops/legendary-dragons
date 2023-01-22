Feature: Deck Context

Scenario: Create deck
  Given there is an user and the registered user is logged in
  When I create a new deck
  Then the deck should be created

  Scenario: Add card to main deck
  Given there is an user and the registered user is logged in
  When I request to add a card to the main deck
  Then the main deck collection is updated and should contain the new card

Scenario: Add card to side deck
  Given there is an user and the registered user is logged in
  When I request to add a card to the side deck
  Then the side deck collection is updated and should contain the new card

Scenario: Get deck
Given there is an user and the registered user is logged in
When I request to see the details of my deck
Then I should be able to see my deck details including main deck and side deck cards

Scenario: Get decks
  Given there is an user and the registered user is logged in
  When I request for my decks
  Then I should be able to see all my decks

Scenario: Remove card from main deck
  Given there is an user and the registered user is logged in
  When I request to remove a card from the main deck
  Then the main deck collection is updated and the card is removed

Scenario: Remove card from side deck
  Given there is an user and the registered user is logged in
  When I request to remove a card from the side deck
  Then the side deck collection is updated and the card is removed

Scenario: Remove deck
   Given there is an user and the registered user is logged in
   When I request to remove a deck
   Then the deck should be removed from all my decks
