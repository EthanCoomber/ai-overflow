import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const newQuestion = {
    title: "How to add a question to the database?",
    text: "I am trying to add a question to the database using JavaScript, but I am not sure how to do it. Can someone help me?",
    tags: "database javascript",
    user: "elephantCDE"
};


function fillForm(q) {
    if(q.title)
        cy.get('#question-title-input').type(q.title);
    if(q.text)
        cy.get('#question-text-input').type(q.text);
    if(q.tags)
        cy.get('#question-tags-input').type(q.tags);
    if(q.user)
        cy.get('#question-username-input').type(q.user);
}

// Scenario: Add a new question successfully
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the necessary fields
//     And clicks the "Post Question" button
//     Then The user should see the new question in the All Questions page with the metadata information

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
});

When('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

And('fills out the necessary fields', () => {
    fillForm(newQuestion);
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the new question in the All Questions page with the metadata information', () => {
    cy.contains("All Questions");
    cy.get("#question-title").first().should("contain", newQuestion.title);
    cy.get("#question-author").first().should("contain", newQuestion.user);
    cy.get("#question-time").first().should("contain", "0 seconds");
});

// Scenario: Add a new question with empty title
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form with an empty title
//     And clicks the "Post Question" button
//     Then The user should see the error message "Title cannot be empty"

And('fills out the form with an empty title', () => {
    fillForm({ ...newQuestion, title: "" });
});

Then('The user should see the error message {string}', (errorMessage) => {
    cy.contains(errorMessage);
});

// Scenario: Add a new question with title exceeding character limit
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form with a title longer than 100 characters
//     And clicks the "Post Question" button
//     Then The user should see the error message "Title cannot be more than 100 characters"

And('fills out the form with a title longer than 100 characters', () => {
    fillForm({ ...newQuestion, title: "a".repeat(101) });
});

// Scenario: Add a new question with empty text
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form with empty question text
//     And clicks the "Post Question" button
//     Then The user should see the error message "Question text cannot be empty"

And('fills out the form with empty question text', () => {
    fillForm({ ...newQuestion, text: "" });
});

// Scenario: Add a new question with no tags
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form without any tags
//     And clicks the "Post Question" button
//     Then The user should see the error message "Should have at least one tag"

And('fills out the form without any tags', () => {
    fillForm({ ...newQuestion, tags: "" });
});

// Scenario: Add a new question with too many tags
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form with more than five tags
//     And clicks the "Post Question" button
//     Then The user should see the error message "More than five tags is not allowed"

And('fills out the form with more than five tags', () => {
    fillForm({ ...newQuestion, tags: "tag1 tag2 tag3 tag4 tag5 tag6" });
});

// Scenario: Add a new question with a tag that is too long
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form with a tag longer than 20 characters
//     And clicks the "Post Question" button
//     Then The user should see the error message "New tag length cannot be more than 20"

And('fills out the form with a tag longer than 20 characters', () => {
    fillForm({ ...newQuestion, tags: "a".repeat(21) });
});

// Scenario: Add a new question with empty username
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form with an empty username
//     And clicks the "Post Question" button
//     Then The user should see the error message "Username cannot be empty"

And('fills out the form with an empty username', () => {
    fillForm({ ...newQuestion, user: "" });
});