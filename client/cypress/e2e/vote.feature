Feature: Upvote question
  As a user with write access to Fake Stack Overflow
  I want to upvote a question
  So that I can contribute to the community

  Scenario: Upvote a question successfully
    Given The user is viewing a question
    And The user clicks the vote button
    Then The user should see the vote count incremented

  Scenario: Upvoting a question twice does not double-count
    Given The user is viewing a question
    When The user clicks the vote button once
    And The user clicks the vote button again
    Then The vote count should only increment by one

  Scenario: Votes count updated sucessfully on the individual question page
    Given The user is viewing a question
    And The user clicks the vote button
    Then The user should see the vote count incremented
    And The user navigates to the question page
    And The vote count is updated there too
