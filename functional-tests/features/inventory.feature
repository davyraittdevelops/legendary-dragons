Feature: Inventory Context

Scenario: Add card to inventory
    Given I have an inventory
    When we add the card with the received data to the inventory
    Then the inventory should contain a new card

Scenario: Get inventory
    Given I have an inventory
    When I request for my inventory
    Then I should be able to see my collection
