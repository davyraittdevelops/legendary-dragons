Feature: Identity & Access Context

Scenario: Registering a new user
    Given we have no user
    When we register with email 'kostas.mylothridis@student.hu.nl' and password 'Th3bestPassword!'
    Then the user should be registered

Scenario: Login an existing user
    Given we have a registered user with email 'kostas.mylothridis@student.hu.nl' and password 'Th3bestPassword!'
    When we login the existing user
    Then the user should be logged in
