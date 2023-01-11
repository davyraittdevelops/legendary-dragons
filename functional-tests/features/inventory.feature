Feature: Inventory Context

Scenario: Add card to inventory
    Given we have a request for adding a new card to the inventory
    When we add the card with the received data to the inventory
    Then the inventory should contain a new card
