Feature: Deck Context

Scenario: Create deck
   Given there is an user and the registered user is logged in
   When I create a new deck
   Then the deck should be created

Scenario: Get decks
   Given there is an user and the registered user is logged in
   When I request for my decks
   Then I should be able to see all my decks

Scenario: Remove deck
    Given there is an existing user, the user is logged in and the user has atleast one deck
    When I request to remove a deck
    Then the deck should be removed from all my decks
