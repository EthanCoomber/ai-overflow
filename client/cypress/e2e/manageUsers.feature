Feature: User Account Management
  As a user of Fake Stack Overflow
  I want to create and manage my account
  So that I can participate in the community

  Scenario: Successful Account Creation
    Given I am a new user to the platform
    When I provide a valid username and password
    Then my account should be successfully created

  Scenario: Duplicate Email or Username Error
    Given I am attempting to create a new account
    When I provide a username that already exists
    Then I should receive an error indicating the conflict

  Scenario: Password Strength Validation
    Given I am creating a new account
    When I enter a weak password
    Then I should receive an error requesting a stronger password

  Scenario: Successful Login
    Given I am a registered user
    When I provide my correct username and password
    Then I should be successfully logged in and redirected to my dashboard

  Scenario: Incorrect Login Details
    Given I am a registered user with an account
    When I enter an incorrect username or password
    Then I should see an error message indicating invalid credentials
