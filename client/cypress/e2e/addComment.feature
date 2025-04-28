Feature: Adding new comment
    As a user with write access to Fake Stack Overflow
    I want to add a new comment to a question
    So that I can contribute to the community

  Scenario: Add a new comment successfully
    Given The user is viewing a question with answers
    And The user enters valid comment text
    And The user clicks the "Add Comment" button
    Then The user should see the new comment in the question page
    And The comment should display correct metadata information


  Scenario: Add a new comment and comment count should increment
    Given The user is viewing a question
    And The user enters valid comment text
    And The user clicks the "Add Comment" button
    And The user should see the new comment in the question page
    When The user clicks on the "Questions" menu item
    And The comment count for that question should have incremented