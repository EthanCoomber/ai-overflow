Feature: Show Questions with no answers
As a user with read access to fake stack overflow
I want to see all questions in the database that have no answers
So that I can find questions I might be able to answer

  Scenario: Show all unanswered questions on user request
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user clicks on the "Unanswered" tab
    Then The user should see only questions that have no answers

  Scenario Outline: Return to the Unanswered tab after viewing questions in another order
    Given The user is viewing questions in "<currentOrder>"
    When The user clicks on the "Unanswered" order
    Then The user should see only questions that have no answers

    Examples:
      | currentOrder |
      | Active       |
      | Newest       |

  Scenario: Return to Unanswered after viewing Tags
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    And clicks on the "Questions" menu item
    And clicks on the "Unanswered" tab
    Then The user should see only questions that have no answers

  Scenario: View unanswered questions after asking a new question
    Given The user is viewing the homepage "http://localhost:3000"
    And The user has created a new question
    When The user clicks on the "Unanswered" tab in the "Questions" page
    Then The user should see the new question in the list of unanswered questions