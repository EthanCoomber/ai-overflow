import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

// Scenario: Search questions by search string
//     Given The user can access the homepage "http://localhost:3000"
//     When The user enters a search string "Quick question" in the search box
//     And The user submits the search
//     Then The user should see questions containing the search string "Quick question"

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
});

When('The user enters a search string {string} in the search box', (searchString) => {
    cy.get('#search-input').type(searchString);
    cy.wrap(searchString).as('searchTerm');
});

And('The user submits the search', () => {
    cy.get('#search-button').click();
});

Then('The user should see questions containing the search string {string}', (searchString) => {
    cy.get('.question_list').should('exist');
    cy.get('.postTitle').should('have.length.at.least', 1);
    cy.get('.postTitle, .postText').should('contain', searchString);
});

// Scenario: Search questions by tagname
//     Given The user can access the homepage "http://localhost:3000"
//     When The user enters a tagname "[javascript]" in the search box
//     And The user submits the search
//     Then The user should see questions with the tag "javascript"

When('The user enters a tagname {string} in the search box', (tagWithBrackets) => {
    cy.get('#search-input').type(tagWithBrackets);
    const tagName = tagWithBrackets.replace(/^\[|\]$/g, '');
    cy.wrap(tagName).as('tagName');
});

Then('The user should see questions with the tag {string}', (tagName) => {
    cy.get('.question_list').should('exist');
    cy.get('.postTitle').should('have.length.at.least', 1);
});

// Scenario: Search with no results
//     Given The user can access the homepage "http://localhost:3000"
//     When The user enters a search string "nonexistentquestion123" in the search box
//     And The user submits the search
//     Then The user should see a message indicating no questions were found

Then('The user should see a message indicating no questions were found', () => {
    cy.contains('No Questions Found').should('be.visible');
});

// Scenario: Return to all questions after search
//     Given The user can access the homepage "http://localhost:3000"
//     And The user has performed a search with the term "javascript"
//     When The user clicks on the "Questions" menu item
//     Then The user should see all questions in the system

Given('The user has performed a search with the term {string}', (searchTerm) => {
    cy.get('#search-input').type(searchTerm);
    cy.get('#search-button').click();
});

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

Then('The user should see all questions in the system', () => {
    cy.get('.question_list').should('exist');
    cy.get('.postTitle').should('have.length.at.least', 1);
    cy.contains('All Questions').should('be.visible');
});

// Scenario: Search with multiple tagnames
//     Given The user can access the homepage "http://localhost:3000"
//     When The user enters multiple tagnames "[javascript] [react]" in the search box
//     And The user submits the search
//     Then The user should see questions with both tags "javascript" and "react"

When('The user enters multiple tagnames {string} in the search box', (multipleTags) => {
    cy.get('#search-input').type(multipleTags);
});

Then('The user should see questions with both tags {string} and {string}', (tag1, tag2) => {
    cy.get('.question_list').should('exist');
    cy.get('.postTitle').should('have.length.at.least', 1);
});

// Scenario: Search with combination of tagname and search string
//     Given The user can access the homepage "http://localhost:3000"
//     When The user enters "[javascript] function" in the search box
//     And The user submits the search
//     Then The user should see questions with the tag "javascript" containing the word "function"

When('The user enters {string} in the search box', (searchInput) => {
    cy.get('#search-input').type(searchInput);
});

Then('The user should see questions with the tag {string} containing the word {string}', () => {
    cy.get('.question_list').should('exist');
    cy.get('.postTitle').should('have.length.at.least', 1);
});
