import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const Q5_TITLE = "Test Question A";

function verifyUnansweredQuestions() {
    // In the sample data, Q3 is the only question without answers
    cy.get(".postTitle").should("have.length", 0);
}

function createQuestion(title, text, tag, username) {
    cy.contains("Ask a Question").click();
    cy.get("#question-title-input").type(title);
    cy.get("#question-text-input").type(text);
    cy.get("#question-tags-input").type(tag);
    cy.get("#question-username-input").type(username);
    cy.contains("Post Question").click();
}

// Scenario: Show all unanswered questions on user request
//     Given The user can access the homepage "http://localhost:3000"
//     And can see the homepage "All Questions"
//     When The user clicks on the "Unanswered" tab
//     Then The user should see only questions that have no answers

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
});

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
});

When('The user clicks on the {string} tab', (orderName) => {
    cy.contains(orderName).click();
});

Then('The user should see only questions that have no answers', () => {
    verifyUnansweredQuestions();
});

// Scenario Outline: Return to the Unanswered tab after viewing questions in another order
//     Given The user is viewing questions in "<currentOrder>"
//     When The user clicks on the "Unanswered" order
//     Then The user should see only questions that have no answers

Given('The user is viewing questions in {string}', (currentOrder) => {
    cy.visit("http://localhost:3000");
    cy.contains(currentOrder).click();
});

When('The user clicks on the {string} order', (orderName) => {
    cy.contains(orderName).click();
});

// Scenario: Return to Unanswered after viewing Tags
//     Given The user is viewing the homepage "http://localhost:3000"
//     When The user clicks on the "Tags" menu item
//     And clicks on the "Questions" menu item
//     And clicks on the "Unanswered" tab
//     Then The user should see only questions that have no answers

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
});

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
});

// Scenario: View unanswered questions after asking a new question
//     Given The user is viewing the homepage "http://localhost:3000"
//     And The user has created a new question
//     When The user clicks on the "Unanswered" tab in the "Questions" page
//     Then The user should see the new question in the list of unanswered questions

And('The user has created a new question', () => {
    createQuestion(Q5_TITLE, "Test Question A Text", "javascript", "mks1");
});

When('The user clicks on the {string} tab in the {string} page', (tabName, pageName) => {
    cy.contains(pageName).click();
    cy.contains(tabName).click();
});

Then('The user should see the new question in the list of unanswered questions', () => {
    cy.get(".postTitle").should("contain", Q5_TITLE);
    cy.get(".postTitle").should("have.length", 1);
});