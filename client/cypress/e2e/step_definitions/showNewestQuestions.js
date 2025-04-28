import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Quick question about storage on android";
const Q4_TITLE = "Object storage for a web application";
const Q5_TITLE = "Test Question A";

function verifyNewestOrder() {
  const qTitleByNewest = [Q3_TITLE, Q4_TITLE, Q2_TITLE, Q1_TITLE];

  cy.get(".postTitle", { timeout: 10000 }).should("have.length.at.least", qTitleByNewest.length);

  cy.get(".postTitle").each(($el, index) => {
    cy.wrap($el).should("contain", qTitleByNewest[index]);
  });
}

function createQuestion(title, text, tag, username) {
  cy.contains("Ask a Question").click();
  cy.get("#question-title-input").type(title);
  cy.get("#question-text-input").type(text);
  cy.get("#question-tags-input").type(tag);
  cy.get("#question-username-input").type(username);
  cy.contains("Post Question").click();
}

// Scenario: Show all questions in newest order on user request
Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

And("can see the homepage {string}", (pageName) => {
  cy.contains(pageName, { timeout: 10000 }).should("be.visible");
});

When("The user clicks on the {string} tab", (orderName) => {
  cy.contains(orderName, { timeout: 10000 }).click();
});

Then("The user should see all questions in the database with the most recently asked questions first", () => {
  verifyNewestOrder();
});

// Scenario Outline: Return to the Newest tab after viewing questions in another order
Given("The user is viewing questions in {string}", (currentOrder) => {
  cy.visit("http://localhost:3000");
  cy.contains(currentOrder, { timeout: 10000 }).click();
});

When("The user clicks on the {string} order", (orderName) => {
  cy.contains(orderName, { timeout: 10000 }).click();
  cy.wait(1000);
  cy.get(".postTitle", { timeout: 10000 }).should("exist");
});

Then("The questions should be shown in newest order", () => {
  cy.wait(1000);
  verifyNewestOrder();
});

// Scenario: Return to Newest after viewing Tags
Given("The user is viewing the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user clicks on the {string} menu item", (menuItem) => {
  cy.contains(menuItem, { timeout: 10000 }).click();
});

And("clicks on the {string} menu item", (menuItem) => {
  cy.contains(menuItem, { timeout: 10000 }).click();
});

And("clicks on the {string} tab", (tabName) => {
  cy.contains(tabName, { timeout: 10000 }).click();
});

Then("The user should see questions ordered by newest again", () => {
  cy.wait(1000);
  verifyNewestOrder();
});

// Scenario: View questions in newest order after asking a new question
And("The user has created a new question", () => {
  createQuestion(Q5_TITLE, "Test Question A Text", "javascript", "mks1");
});

When("The user clicks on the {string} tab in the {string} page", (tabName, pageName) => {
  cy.contains(pageName, { timeout: 10000 }).click();
  cy.contains(tabName, { timeout: 10000 }).click();
});

Then("The user should see the new question at the top of the list", () => {
  cy.contains(".postTitle", Q5_TITLE, { timeout: 10000 }).should("exist");
  cy.get(".postTitle", { timeout: 10000 }).first().should("contain", Q5_TITLE);
});

// Scenario: Verify correct date ordering of questions
And("There are multiple questions with different dates", () => {
  cy.exec("npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so");
});

Then("The questions should be ordered by date with newest first", () => {
  cy.wait(1000);
  verifyNewestOrder();
});

And("The user should see the correct metadata for each question", () => {
  cy.get("#question-stats", { timeout: 10000 }).should("exist");
  cy.get(".postMetadata", { timeout: 10000 }).should("exist");
});
