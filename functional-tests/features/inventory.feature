Feature: Inventory Context

Scenario: Add card to inventory
   Given there is an existing user and the user is logged in
   When we add the card with the received data to the inventory
   Then the inventory should contain a new card

Scenario: Get inventory
   Given there is an existing user and the user is logged in
   When I request for my inventory
   Then I should be able to see my collection

Scenario: Remove card from inventory
   Given there is an existing user and the user is logged in
   When we remove the card with the received data from the inventory
   Then the card should be removed from the inventory
