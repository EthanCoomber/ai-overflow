Feature: View Answers
As a user with read access to fake stack overflow
I want to see all answers for questions that have answers
So that I can find solutions to problems

  Scenario: View answers for a question
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks on a question that has answers
    Then The user should see all answers for that question
    And Each answer should display the answer text

  Scenario: View answer metadata
    Given The user is viewing a question with answers
    Then Each answer should display the username of the answerer
    And Each answer should display when it was posted

  Scenario: Navigate back to questions after viewing answers
    Given The user is viewing a question with answers
    When The user clicks on the "Questions" menu item
    Then The user should see the list of questions

  Scenario: View answers sorted by newest first
    Given The user is viewing a question with multiple answers
    Then The answers should be displayed with the newest first

  Scenario: View a question with no answers
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks on a question that has no answers
    Then The user should see a message indicating no answers are available