Feature: Routing and Navigation
  As a user of Fake Stack Overflow
  I want to navigate between different pages
  So that I can access various features of the application

  Scenario: Navigation to different pages updates URL and renders correct components
    Given The user visits the application "http://localhost:3000"
    When The user navigates to the "Ask a Question" page
    Then The URL should be updated to "/new-question"
    And The Ask Question form should be displayed
    When The user navigates to the "Questions" page
    Then The URL should be updated to "/"
    And The All Questions list should be displayed

  Scenario: Direct URL access renders the correct components
    Given The user directly accesses the URL "http://localhost:3000/new-question"
    Then The Ask Question form should be displayed
    Given The user directly accesses the URL "http://localhost:3000/"
    Then The All Questions list should be displayed


  Scenario: Back and forward browser navigation works correctly
    Given The user visits the application "http://localhost:3000"
    When The user navigates to the "Ask a Question" page
    And The user navigates to the "Questions" page
    And The user clicks the browser back button
    Then The URL should be updated to "/new-question"
    And The Ask Question form should be displayed
    When The user clicks the browser forward button
    Then The URL should be updated to "/"
    And The All Questions list should be displayed
