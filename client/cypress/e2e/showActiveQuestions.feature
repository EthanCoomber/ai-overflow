Feature: Show Questions by recent answers
As a user with read access to fake stack overflow
I want to see all questions in the database in most recently answered or active order
So that I can view the questions that were answered most recently

  Scenario: Show all questions in active order on user request
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user clicks on the "Active" tab
    Then The user should see all questions in the database with the most recently posted answers first

  Scenario Outline: Return to the Active tab after viewing questions in another order
    Given The user is viewing questions in "<currentOrder>"
    When The user clicks on the "Active" order
    Then The user should see all questions in the database with the most recently posted answers first

    Examples:
      | currentOrder |
      | Newest       |
      | Unanswered   |

  Scenario: Return to Active after viewing Tags
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    And clicks on the "Questions" menu item
    And clicks on the "Active" tab
    Then The user should see all questions in the database with the most recently posted answers first

  Scenario: View questions in active order after answering questions
    Given The user is viewing the homepage "http://localhost:3000"
    And The user has created a new question
    And The user answers the new question
    When The user clicks on the "Active" tab in the "Questions" page
    Then The user should see the recently answered question at the top of the list

  Scenario: No questions available in the system
    Given The user can access the homepage "http://localhost:3000"
    And There are no questions in the system
    When The user clicks on the "Active" tab
    Then The user should see a message indicating no questions are available

  Scenario: No answered questions available
    Given The user can access the homepage "http://localhost:3000"
    And There are questions but none have answers
    When The user clicks on the "Active" tab
    Then The user should see questions ordered by their creation date

  Scenario: Verify correct ordering of questions by answer time
    Given The user can access the homepage "http://localhost:3000"
    And There are multiple questions with answers at different times
    When The user clicks on the "Active" tab
    Then The questions should be ordered by most recent answer time
    And The user should see the correct metadata for each question
