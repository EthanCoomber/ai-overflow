Feature: Search Questions
As a user with read access to fake stack overflow
I want to search for questions using search strings or tagnames
So that I can find specific questions I'm interested in

  Scenario: Search questions by search string
    Given The user can access the homepage "http://localhost:3000"
    When The user enters a search string "Quick question" in the search box
    And The user submits the search
    Then The user should see questions containing the search string "Quick question"

  Scenario: Search questions by tagname
    Given The user can access the homepage "http://localhost:3000"
    When The user enters a tagname "[javascript]" in the search box
    And The user submits the search
    Then The user should see questions with the tag "javascript"

  Scenario: Search with no results
    Given The user can access the homepage "http://localhost:3000"
    When The user enters a search string "nonexistentquestion123" in the search box
    And The user submits the search
    Then The user should see a message indicating no questions were found

  Scenario: Return to all questions after search
    Given The user can access the homepage "http://localhost:3000"
    And The user has performed a search with the term "javascript"
    When The user clicks on the "Questions" menu item
    Then The user should see all questions in the system

  Scenario: Search with multiple tagnames
    Given The user can access the homepage "http://localhost:3000"
    When The user enters multiple tagnames "[javascript] [react]" in the search box
    And The user submits the search
    Then The user should see questions with both tags "javascript" and "react"

  Scenario: Search with combination of tagname and search string
    Given The user can access the homepage "http://localhost:3000"
    When The user enters "[javascript] function" in the search box
    And The user submits the search
    Then The user should see questions with the tag "javascript" containing the word "function"
