Feature: View Tags
As a user with read access to fake stack overflow
I want to see all tags in the system and the number of questions associated with each tag
So that I can find questions related to specific topics

  Scenario: View all tags in the system
    Given The user can access the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    Then The user should see a list of all tags in the system
    And Each tag should display the number of questions associated with it

  Scenario: Navigate to questions with a specific tag
    Given The user is viewing the tags page
    When The user clicks on a specific tag
    Then The user should see all questions associated with that tag

  Scenario: Return to Tags after viewing Questions
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Questions" menu item
    And The user clicks on the "Tags" menu item
    Then The user should see a list of all tags in the system

  Scenario: View tags after asking a new question with a new tag
    Given The user is viewing the homepage "http://localhost:3000"
    And The user has created a new question with a new tag
    When The user clicks on the "Tags" menu item
    Then The user should see the new tag in the list of tags

  Scenario: No tags available in the system
    Given The user can access the homepage "http://localhost:3000"
    And There are no tags in the system
    When The user clicks on the "Tags" menu item
    Then The user should see a message indicating no tags are available