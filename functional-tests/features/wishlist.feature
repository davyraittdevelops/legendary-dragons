Feature: Wishlist Context

Scenario: Create price alert
   Given there is an user and this user is logged in
   When I request to create a price alert with price point: '5.00'
   Then a price alert is created

# Scenario: Create availability alert
#    Given there is an user and this user is logged in
#    When I request to create a availability alert
#    Then a availability alert is created

# Scenario: Get alerts
#    Given there is an user and this user is logged in
#    When I request for my alerts
#    Then I should be able to see my alerts

# Scenario: Remove price alert
#    Given there is an user and this user is logged in
#    When I request to remove a price alert with price point: '5.00'
#    Then a price alert is removed

# Scenario: Remove availability alert
#    Given there is an user and this user is logged in
#    When I request to remove a availability alert
#    Then a availability alert is removed

# Scenario: Create wishlist item
#    Given there is an user and this user is logged in
#    When I add a new card to the wishlist
#    Then the wishlist should contain a new card

# Scenario: Get wishlist
#    Given there is an user and this user is logged in
#    When I request for my wishlist
#    Then I should be able to see my wishlist

# Scenario: Remove wishlist item
#    Given there is an user and this user is logged in
#    When I remove a card from the wishlist
#    Then the wishlist item should be removed from the wishlist
   