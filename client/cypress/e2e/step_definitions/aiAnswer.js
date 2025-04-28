import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

// Ensure Cypress is globally available for ESLint
/* global cy, Cypress */

// Mock all AI responses before tests run
beforeEach(() => {
  // Default successful AI response mock
  cy.intercept('GET', '**/getAIAnswer/*', {
    statusCode: 200,
    delayMs: 500,
    body: 'This is a mocked AI-generated answer. It contains helpful information about the question that was asked.'
  }).as('defaultAIAnswer');
});

// Background steps
Given('I am logged in to the application', () => {
  cy.url().should('not.include', '/login');
});

Given('I am viewing a question details page', () => {
  cy.visit('http://localhost:3000');

  cy.get("#question-title").first().click();

  cy.get('#question-answer-content').should('be.visible');
  cy.url().should('include', '/question/');
});

// AI Answer Generation
When('I click on the "Get AI Answer" button', () => {
  cy.get('#get-ai-answer-button').scrollIntoView();
  cy.get('#get-ai-answer-button').should('be.visible').click();
});

Then('I should see a loading indicator', () => {
  cy.contains('Generating AI Answer...').should('be.visible');
});

Then('an AI-generated answer should be displayed', () => {
  cy.wait('@defaultAIAnswer');
  cy.get('#ai-answer-container', { timeout: 30000 }).should('exist').and('be.visible');
  cy.get('#ai-answer-status').should('contain', 'Generating...');
  cy.get('#ai-answer-content').should('exist').and('not.be.empty');
});

// Mock AI response
When('I mock a successful AI response', () => {
  cy.intercept('GET', '**/getAIAnswer/*', {
    statusCode: 200,
    delayMs: 500,
    body: 'This is a mocked AI-generated answer. It contains helpful information about the question that was asked.'
  }).as('mockAIAnswer');
});

Then('I should see the mocked AI answer', () => {
  cy.get('#get-ai-answer-button').scrollIntoView();
  cy.get('#get-ai-answer-button').click();
  cy.wait('@mockAIAnswer');
  cy.get('#ai-answer-content', { timeout: 10000 }).should('be.visible');
  cy.get('#ai-answer-content').should('contain', 'This is a mocked AI-generated answer');
});

// Error handling
When('the AI service is unavailable', () => {
  cy.intercept('GET', '**/getAIAnswer/*', {
    statusCode: 500,
    body: { error: 'Service unavailable' },
    delayMs: 100,
    response: {
      statusCode: 500,
      body: { error: 'Service unavailable' }
    }
  }).as('aiAnswerError');
});

Then('I should see an error message', () => {
  cy.get('#get-ai-answer-button').scrollIntoView();
  cy.get('#get-ai-answer-button').click();
  cy.wait('@aiAnswerError');
  cy.get('#ai-answer-error', { timeout: 10000 }).should('be.visible');
  cy.get('#ai-answer-error').contains(Cypress._.escapeRegExp('There was an error generating the AI answer'));
});

// Rate limiting
When('I exceed the rate limit for AI answer generation', () => {
  cy.intercept('GET', '**/getAIAnswer/*', {
    statusCode: 429,
    delayMs: 100,
    body: { error: 'Too many requests. Please try again later.' },
    headers: {
      'Content-Type': 'application/json'
    },
    response: {
      statusCode: 429,
      body: { error: 'Too many requests. Please try again later.' }
    }
  }).as('rateLimitError');
});

Then('I should see a rate limit error message', () => {
  cy.get('#get-ai-answer-button').scrollIntoView();
  cy.get('#get-ai-answer-button').click();
  cy.wait('@rateLimitError');
  cy.get('#ai-answer-error', { timeout: 10000 }).should('be.visible');
  cy.get('#ai-answer-error').contains(Cypress._.escapeRegExp('There was an error generating the AI answer'));
});

// UI Integration
When('I mock a successful AI response for UI check', () => {
  cy.intercept('GET', '**/getAIAnswer/*', {
    statusCode: 200,
    delayMs: 500,
    body: 'This is a stable AI answer used for UI verification.'
  }).as('uiMockAIAnswer');
});

Then('Ensure UI consistency', () => {
  cy.get('#get-ai-answer-button').click();
  cy.wait('@uiMockAIAnswer');
  cy.get('#ai-answer-container', { timeout: 30000 }).should('exist').and('be.visible');
  cy.get('#ai-answer-content').should('contain', 'stable AI answer');
});

Then('the AI answer should be formatted properly', () => {
  cy.get('#ai-answer-container').scrollIntoView();
  cy.get('#ai-answer-container').within(() => {
    cy.contains('AI Assistant').should('be.visible');
    cy.get('#ai-answer-content').should('be.visible');
  });
});

Then('the AI answer should maintain design consistency with other answers', () => {
  cy.get('#ai-answer-container').scrollIntoView();
  cy.get('#ai-answer-container').should('exist');

  cy.get('#ai-answer-container').within(() => {
    cy.get('#ai-answer-content').should('exist');
  });
});

// Button state
Then('the "Get AI Answer" button should be disabled after generating an answer', () => {
  cy.get('#get-ai-answer-button').scrollIntoView();
  cy.get('#get-ai-answer-button').should('be.disabled');
  cy.get('#get-ai-answer-button').contains('AI Answer Generated');
});
