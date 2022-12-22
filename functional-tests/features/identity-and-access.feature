Feature: Identity & Access Context

Scenario: Registering a new user
    Given we have no user
    When we register with email 'gino.evripidou@student.hu.nl' and password 'Eindopdracht3!'
    Then the user should be registered

Scenario: Login an existing user
    Given we have a registered user with email 'gino.evripidou@student.hu.nl' and password 'Eindopdracht3!'
    When we login the existing user
    Then the user should be logged in
