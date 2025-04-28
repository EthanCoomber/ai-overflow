import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

When('I navigate to the signup page', () => {
  cy.visit('/')
})

Then('The user can see the title', () => {
  cy.title().should('exist') // or whatever check you want
})
