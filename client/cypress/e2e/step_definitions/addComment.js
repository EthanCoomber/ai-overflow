import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const newComment = {
    text: "This is a very good question",
    comment_by: "testUser"
};

function fillComment(c) {
    if (c.text)
        cy.get('#comment-input').type(c.text);
}

// Scenario: Add a new comment successfully
// Given The user is viewing a question with answers
// And The user enters valid comment text
// And The user clicks the "Add Comment" button
// Then The user should see the new comment in the question page
// And The comment should display correct metadata information
Given('The user is viewing a question with answers', () => {
    cy.visit("http://localhost:3000");
    cy.get("#question-title").first().click();
    cy.get("#answer-0").should("exist");
});

And('The user enters valid comment text', () => {
    fillComment({ text: newComment.text });
});

And('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the new comment in the question page', () => {
    cy.get("#comments-list").should("contain", newComment.text);
});

And('The comment should display correct metadata information', () => {
    cy.get("#comments-list").should("contain", "0 seconds");
});

let initialCommentCount = 0;

// Scenario: Add a new comment and comment count should increment
//     Given The user is viewing a question
//     And The user enters valid comment text
//     And The user clicks the "Add Comment" button
//     And The user should see the new comment in the question page
//     When The user clicks on the "Questions" menu item
//     And The comment count for that question should have incremented
Given('The user is viewing a question', () => {
    cy.visit("http://localhost:3000");

    cy.get("#question-card").first().within(() => {
        cy.get("#comment-count")
            .invoke("text")
            .then((text) => {
                const match = text.match(/\d+/); // extract number
                if (match) {
                    initialCommentCount = parseInt(match[0]);
                }
            });
    });

    cy.get("#question-title").first().click();
    cy.get("#answer-0").should("exist");
});

And('The user enters valid comment text', () => {
    fillComment({ text: newComment.text });
});

And('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the new comment in the question page', () => {
    cy.get("#comments-list").should("contain", newComment.text);
});

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('The comment count for that question should have incremented', () => {
    const expectedCount = initialCommentCount + 1;
    cy.get("#question-card").first().within(() => {
        cy.get("#comment-count").should("contain", `${expectedCount} comments`);
    });
});
