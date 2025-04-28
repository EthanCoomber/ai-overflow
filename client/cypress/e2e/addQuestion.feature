Feature: Adding new questions
    As a user with write access to Fake Stack Overflow
    I want to add a new question to the application
    So that I can ask a question to the community

  Scenario: Add a new question successfully
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the necessary fields
    And clicks the "Post Question" button
    Then The user should see the new question in the All Questions page with the metadata information

  Scenario: Add a new question with empty title
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the form with an empty title
    And clicks the "Post Question" button
    Then The user should see the error message "Title cannot be empty"

  Scenario: Add a new question with title exceeding character limit
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the form with a title longer than 100 characters
    And clicks the "Post Question" button
    Then The user should see the error message "Title cannot be more than 100 characters"

  Scenario: Add a new question with empty text
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the form with empty question text
    And clicks the "Post Question" button
    Then The user should see the error message "Question text cannot be empty"

  Scenario: Add a new question with no tags
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the form without any tags
    And clicks the "Post Question" button
    Then The user should see the error message "Should have at least one tag"

  Scenario: Add a new question with too many tags
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the form with more than five tags
    And clicks the "Post Question" button
    Then The user should see the error message "More than five tags is not allowed"

  Scenario: Add a new question with a tag that is too long
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the form with a tag longer than 20 characters
    And clicks the "Post Question" button
    Then The user should see the error message "New tag length cannot be more than 20"

  Scenario: Add a new question with empty username
    Given The user has write access to the application "http://localhost:3000"
    When The user clicks the "Ask a Question" button
    And fills out the form with an empty username
    And clicks the "Post Question" button
    Then The user should see the error message "Username cannot be empty"