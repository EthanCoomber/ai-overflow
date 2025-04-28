Feature: AI Answer Generation
  As a user of Fake Stack Overflow
  I want to get AI-generated answers to questions
  So that I can quickly get insights without waiting for human responses

  Background:
    Given I am logged in to the application
    And I am viewing a question details page

  Scenario: Generate an AI answer successfully
    When I click on the "Get AI Answer" button
    Then I should see a loading indicator
    And an AI-generated answer should be displayed
    And the AI answer should be formatted properly
    And the "Get AI Answer" button should be disabled after generating an answer

  Scenario: Handle AI service errors
    When the AI service is unavailable
    Then I should see an error message

  Scenario: Handle rate limiting
    When I exceed the rate limit for AI answer generation
    Then I should see a rate limit error message

  Scenario: Ensure UI consistency
    When I click on the "Get AI Answer" button
    Then an AI-generated answer should be displayed
    And the AI answer should maintain design consistency with other answers
