import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

// Scenario: Navigation to different pages updates URL and renders correct components
//     Given The user visits the application "http://localhost:3000"
//     When The user navigates to the "Ask a Question" page
//     Then The URL should be updated to "/new-question"
//     And The Ask Question form should be displayed
//     When The user navigates to the "Questions" page
//     Then The URL should be updated to "/"
//     And The All Questions list should be displayed

Given('The user visits the application {string}', (url) => {
  cy.visit(url);
});

When('The user navigates to the {string} page', (pageName) => {
  cy.contains(pageName).click();
});

Then('The URL should be updated to {string}', (path) => {
  cy.url().should('include', path);
});

Then('The Ask Question form should be displayed', () => {
  cy.get('#question-title-input').should('exist');
  cy.get('#question-text-input').should('exist');
  cy.get('#question-tags-input').should('exist');
  cy.get('#question-username-input').should('exist');
});

Then('The All Questions list should be displayed', () => {
  cy.contains('All Questions').should('exist');
});

Then('The Login form should be displayed', () => {
  cy.contains('Login').should('exist');
  cy.get('input[type="email"]').should('exist');
  cy.get('input[type="password"]').should('exist');
});

Then('The Sign Up form should be displayed', () => {
  cy.get('#signup-title').should('exist');
  cy.get('#signup-form').should('exist');
  cy.get('#signup-button').should('exist');
});

// Scenario: Direct URL access renders the correct components
//     Given The user directly accesses the URL "http://localhost:3000/new-question"
//     Then The Ask Question form should be displayed
//     Given The user directly accesses the URL "http://localhost:3000/"
//     Then The All Questions list should be displayed

Given('The user directly accesses the URL {string}', (url) => {
  cy.visit(url);
});

// Scenario: Back and forward browser navigation works correctly
//     Given The user visits the application "http://localhost:3000"
//     When The user navigates to the "Ask a Question" page
//     And The user navigates to the "Questions" page
//     And The user clicks the browser back button
//     Then The URL should be updated to "/new-question"
//     And The Ask Question form should be displayed
//     When The user clicks the browser forward button
//     Then The URL should be updated to "/"
//     And The All Questions list should be displayed

When('The user clicks the browser back button', () => {
  cy.go('back');
});

When('The user clicks the browser forward button', () => {
  cy.go('forward');
});
