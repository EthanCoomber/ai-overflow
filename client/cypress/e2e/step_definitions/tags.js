import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

// Scenario: View all tags in the system
Given('The user can access the homepage {string}', (url) => {
  cy.visit(url);
});

When('The user clicks on the {string} menu item', (menuItem) => {
  cy.contains(menuItem, { timeout: 10000 }).click();
});

Then('The user should see a list of all tags in the system', () => {
  cy.get("#tag-grid", { timeout: 10000 }).should("exist");
  cy.get(".tag-card", { timeout: 10000 }).should("have.length.at.least", 1);
});

And('Each tag should display the number of questions associated with it', () => {
  cy.get(".tag-card").each(($tag) => {
    cy.wrap($tag).find(".tag-count").should("contain", "questions");
  });
});

// Scenario: Navigate to questions with a specific tag
Given('The user is viewing the tags page', () => {
  cy.visit("http://localhost:3000");
  cy.contains("Tags", { timeout: 10000 }).click();
});

When('The user clicks on a specific tag', () => {
  cy.get(".tag-card", { timeout: 10000 }).first().click();
});

Then('The user should see all questions associated with that tag', () => {
  cy.get("#question-card", { timeout: 10000 }).should("exist");
  cy.get("#question-title").should("have.length.at.least", 1);
});

// Scenario: Return to Tags after viewing Questions
And('clicks on the {string} menu item', (menuItem) => {
  cy.contains(menuItem, { timeout: 10000 }).click();
});

// Scenario: View tags after asking a new question with a new tag
function createQuestionWithNewTag(title, text, tag, username) {
  cy.contains("Ask a Question", { timeout: 10000 }).click();
  cy.get("#question-title-input").type(title);
  cy.get("#question-text-input").type(text);
  cy.get("#question-tags-input").type(tag);
  cy.get("#question-username-input").type(username);
  cy.contains("Post Question").click();
}

And('The user has created a new question with a new tag', () => {
  const newTag = "newtesttag";
  createQuestionWithNewTag(
    "Test Question with New Tag",
    "This is a test question with a new tag",
    newTag,
    "testuser"
  );
  cy.wrap(newTag).as("newTag");
});

Then('The user should see the new tag in the list of tags', function () {
  const newTag = this.newTag;
  // Ensure tag grid loads first
  cy.get("#tag-grid", { timeout: 10000 }).should("exist");
  // Retry until the new tag appears
  cy.get(".tag-name", { timeout: 10000 }).should("contain", newTag);
});

// Scenario: No tags available in the system
And('There are no tags in the system', () => {
  cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
});

Then('The user should see a message indicating no tags are available', () => {
  cy.get("#tag-grid", { timeout: 10000 }).should("exist");
  cy.get(".tag-card").should("not.exist");
});
