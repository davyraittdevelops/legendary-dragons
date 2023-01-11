Feature: Card Context

Scenario: Search card by keyword
    Given there is an existing user and the user is logged in
    When we have a request for searching cards with keyword 'Asmoranomardicadaistinaculdacar'
    Then there should be a result of cards
