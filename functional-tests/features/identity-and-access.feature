Feature: Identity & Access Context

Scenario: Registering a new user
 Given we have no user
 When we register a new user with an email and a password
 Then the user should be registered

Scenario: Login an existing user
 Given we register a new user with an email and a password
 When we login the existing user
 Then the user should be logged in
