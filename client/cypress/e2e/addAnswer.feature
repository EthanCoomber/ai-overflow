Feature: Adding new answers
    As a user with write access to Fake Stack Overflow
    I want to add a new answer to a question
    So that I can contribute to the community

  Scenario: Add a new answer successfully
    Given The user has write access to the application "http://localhost:3000"
    When The user navigates to a question page
    And The user clicks the "Answer Question" button
    And The user enters valid answer text
    And The user enters a valid username
    And The user clicks the "Post Answer" button
    Then The user should see the new answer in the question page
    And The answer should display correct metadata information

  Scenario: Add a new answer with empty text
    Given The user has write access to the application "http://localhost:3000"
    When The user navigates to a question page
    And The user clicks the "Answer Question" button
    And The user leaves the answer text empty
    And The user enters a valid username
    And The user clicks the "Post Answer" button
    Then The user should see the error message "Answer text cannot be empty"

  Scenario: Add a new answer with empty username
    Given The user has write access to the application "http://localhost:3000"
    When The user navigates to a question page
    And The user clicks the "Answer Question" button
    And The user enters valid answer text
    And The user leaves the username field empty
    And The user clicks the "Post Answer" button
    Then The user should see the error message "Username cannot be empty"