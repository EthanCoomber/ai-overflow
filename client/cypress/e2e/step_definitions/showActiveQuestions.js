import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Quick question about storage on android";
const Q4_TITLE = "Object storage for a web application";
const Q5_TITLE = "Test Question A";

function verifyActiveOrder() {
  const qTitleByActivity = [
    Q1_TITLE,
    Q2_TITLE,
    Q3_TITLE,
    Q4_TITLE,
  ];

  // Increase timeout and add wait to ensure page has loaded completely
  cy.wait(1000);
  cy.get(".postTitle", { timeout: 10000 }).should("have.length.at.least", qTitleByActivity.length);

  // Add additional wait to ensure the order has stabilized
  cy.wait(500);
  cy.get(".postTitle").each(($el, index) => {
    cy.wrap($el).should("contain", qTitleByActivity[index]);
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

function createAnswer(qtitle, username, text) {
  cy.contains(qtitle).click();
  cy.contains("Answer Question", { timeout: 10000 }).should("exist").click();
  cy.get("#answer-username-input", { timeout: 10000 }).should("be.visible").type(username);
  cy.get("#answer-text-input", { timeout: 10000 }).should("be.visible").type(text);
  cy.contains("Post Answer", { timeout: 10000 }).should("exist").click();

  // Add buffer to allow backend write and reindexing
  cy.wait(1000);
  cy.contains("Questions", { timeout: 10000 }).click();
}

// Step definitions

Given('The user can access the homepage {string}', (url) => {
  cy.visit(url);
  cy.wait(500); // Add wait after navigation
});

And('can see the homepage {string}', (pageName) => {
  cy.contains(pageName, { timeout: 10000 }).should("be.visible");
});

When('The user clicks on the {string} tab', (orderName) => {
  cy.contains(orderName, { timeout: 10000 }).click();
  cy.wait(1000); // Add wait after tab click to ensure content loads
});

Then('The user should see all questions in the database with the most recently posted answers first', () => {
  verifyActiveOrder();
});

Given('The user is viewing questions in {string}', (currentOrder) => {
  cy.visit("http://localhost:3000");
  cy.wait(1000); // Add wait after navigation
  cy.contains(currentOrder, { timeout: 10000 }).click();
  cy.wait(1000); // Add wait after tab click
});

When('The user clicks on the {string} order', (orderName) => {
  cy.contains(orderName, { timeout: 10000 }).click();
  cy.wait(1500); // Increase wait time to ensure order changes
});

Given('The user is viewing the homepage {string}', (url) => {
  cy.visit(url);
  cy.wait(500); // Add wait after navigation
});

When('The user clicks on the {string} menu item', (menuItem) => {
  cy.contains(menuItem, { timeout: 10000 }).click();
  cy.wait(1000); // Add wait after menu click
});

And('clicks on the {string} menu item', (menuItem) => {
  cy.contains(menuItem, { timeout: 10000 }).click();
  cy.wait(1000); // Add wait after menu click
});

And('clicks on the {string} tab', (tabName) => {
  cy.contains(tabName, { timeout: 10000 }).click();
  cy.wait(1500); // Increase wait time after tab click
});

And('The user has created a new question', () => {
  createQuestion(Q5_TITLE, "Test Question A Text", "javascript", "mks1");
});

And('The user answers the new question', () => {
  createAnswer(Q5_TITLE, "abc3", "Answer Question A");
});

When('The user clicks on the {string} tab in the {string} page', (tabName, pageName) => {
  cy.contains(pageName, { timeout: 10000 }).click();
  cy.wait(1000); // Add wait after page navigation
  cy.contains(tabName, { timeout: 10000 }).click();
  cy.wait(1500); // Increase wait time after tab click
});

Then('The user should see the recently answered question at the top of the list', () => {
  cy.get(".postTitle", { timeout: 10000 }).first().should("contain", Q5_TITLE);
});

And('There are no questions in the system', () => {
  cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
});

Then('The user should see a message indicating no questions are available', () => {
  cy.get(".question_list", { timeout: 10000 }).should("exist");
  cy.get(".postTitle").should("not.exist");
});

And('There are questions but none have answers', () => {
  cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
  createQuestion("Unanswered Question 1", "This is an unanswered question", "javascript", "testuser");
  createQuestion("Unanswered Question 2", "This is another unanswered question", "react", "testuser");
});

Then('The user should see questions ordered by their creation date', () => {
  cy.wait(1000); // Add wait to ensure content loads
  cy.get(".postTitle", { timeout: 10000 }).should("have.length.at.least", 2);
  cy.get(".postTitle").eq(0).should("contain", "Unanswered Question 2");
  cy.get(".postTitle").eq(1).should("contain", "Unanswered Question 1");
});

And('There are multiple questions with answers at different times', () => {
  cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
  createQuestion("Question One", "First question content", "javascript", "user1");
  createQuestion("Question Two", "Second question content", "react", "user2");
  createAnswer("Question One", "answerer1", "First answer");
  createAnswer("Question Two", "answerer2", "Second answer");
});

Then('The questions should be ordered by most recent answer time', () => {
  cy.wait(1500); // Add longer wait to ensure content loads and stabilizes
  cy.get(".postTitle", { timeout: 10000 }).should(($titles) => {
    expect($titles[0]).to.contain.text("Question Two");
    expect($titles[1]).to.contain.text("Question One");
  });
});

And('The user should see the correct metadata for each question', () => {
  cy.get("#question-stats", { timeout: 10000 }).should("exist");
  cy.get(".question_meta", { timeout: 10000 }).should("exist");
});
