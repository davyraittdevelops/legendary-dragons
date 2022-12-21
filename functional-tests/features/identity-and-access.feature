Feature: Identity & Access Context

Scenario: Registering a new user
    Given we have a new user
    When we register with email 'kostas.mylothridis@student.hu.nl' and password 'Th3bestPassword!'
    Then the user should be registered