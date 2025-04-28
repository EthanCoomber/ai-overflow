import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

let initialVoteCount;
let afterFirstVoteCount;

// Scenario: Upvoting a question twice does not double-count
// Given The user is viewing a question
// When The user clicks the vote button once
// And The user clicks the vote button again
// Then The vote count should only increment by one

Given('The user is viewing a question', () => {
    cy.visit("http://localhost:3000");
    cy.get("#vote-container button").first().should("exist");
});

When('The user clicks the vote button', () => {
    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((text) => {
            initialVoteCount = parseInt(text.trim()) || 0;
        });

    cy.get("#vote-container button").first().click();
});

Then('The user should see the vote count incremented', () => {
    cy.wait(500);

    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((updatedText) => {
            const updatedVoteCount = parseInt(updatedText.trim()) || 0;
            expect(updatedVoteCount).to.equal(initialVoteCount + 1);
        });
});

// Scenario: Upvoting a question twice does not double-count
//     Given The user is viewing a question
//     When The user clicks the vote button once
//     And The user clicks the vote button again
//     Then The vote count should only increment by one
Given('The user is viewing a question', () => {
    cy.visit("http://localhost:3000");
    cy.get(".postTitle").first().click();
    cy.get("#vote-container button").first().should("exist");

    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((text) => {
            initialVoteCount = parseInt(text.trim()) || 0;
        });
});

When('The user clicks the vote button once', () => {
    cy.get("#vote-container button").first().click();

    cy.wait(500);

    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((text) => {
            afterFirstVoteCount = parseInt(text.trim()) || 0;
        });
    
    // Verify the button is disabled after the first click
    cy.get("#vote-container button").first().should("be.disabled");
});

When('The user clicks the vote button again', () => {
    // Try to click the button again even though it's disabled
    cy.get("#vote-container button").first().click({force: true});
    cy.wait(500);
});

Then('The vote count should only increment by one', () => {
    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((text) => {
            const finalVoteCount = parseInt(text.trim()) || 0;
            expect(finalVoteCount).to.equal(initialVoteCount + 1);
            expect(finalVoteCount).to.equal(afterFirstVoteCount); // unchanged after second click
        });
    
    // Confirm the button remains disabled
    cy.get("#vote-container button").first().should("be.disabled");
});


// Scenario: Votes count updated sucessfully on the individual question page
//     Given The user is viewing a question
//     And The user clicks the vote button
//     Then The user should see the vote count incremented
//     And The user navigates to the question page
//     And The vote count is updated here too
Given('The user is viewing a question', () => {
    cy.visit("http://localhost:3000");
    cy.get("#vote-container button").first().should("exist");
});

When('The user clicks the vote button', () => {
    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((text) => {
            initialVoteCount = parseInt(text.trim()) || 0;
        });

    cy.get("#vote-container button").first().click();
});

Then('The user should see the vote count incremented', () => {
    cy.wait(500);

    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((updatedText) => {
            const updatedVoteCount = parseInt(updatedText.trim()) || 0;
            expect(updatedVoteCount).to.equal(initialVoteCount + 1);
        });
});

And('The user navigates to the question page', () => {
    cy.get("#menu_question").click();
});

And('The vote count is updated there too', () => {
    cy.wait(500);
    cy.get("#vote-container button")
        .first()
        .invoke("text")
        .then((text) => {
            const updatedVoteCount = parseInt(text.trim()) || 0;
            expect(updatedVoteCount).to.equal(initialVoteCount + 1);
        });
});