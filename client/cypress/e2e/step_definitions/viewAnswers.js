import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

// Helper function to add a question with no answers
const questionWithNoAnswers = {
    title: "Question with no answers",
    text: "This is a test question that has no answers yet.",
    tags: "test noAnswers",
    user: "testUser123"
};

function fillForm(q) {
    if(q.title)
        cy.get("#question-title-input").type(q.title);
    if(q.text)
        cy.get("#question-text-input").type(q.text);
    if(q.tags)
        cy.get("#question-tags-input").type(q.tags);
    if(q.user)
        cy.get("#question-username-input").type(q.user);
}

const newAnswer = {
    text: "This is a sample answer to the question. It provides helpful information and explains the solution clearly.",
    user: "answerGuru123"
};

const newAnswer2 = {
    text: "This is a sample answer to the question. It provides helpful information and explains the solution clearly.",
    user: "answerGuru123"
};

function fillAnswerForm(a) {
    if(a.text)
        cy.get("#answer-text-input").type(a.text);
    if(a.user)
        cy.get("#answer-username-input").type(a.user);
}

// Scenario: View answers for a question
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks on a question that has answers
//     Then The user should see all answers for that question
//     And Each answer should display the answer text

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
});

When('The user clicks on a question that has answers', () => {
    cy.get(".postTitle").first().click();
});

Then('The user should see all answers for that question', () => {
    cy.get("#question-answer-content").should("exist");
    cy.get("#answerPaper").should("have.length.at.least", 1);
});

And('Each answer should display the answer text', () => {
    cy.get("#answerPaper").each(($answer) => {
        cy.wrap($answer).find("#answerText").should("exist");
    });
});

// Scenario: View answer metadata
//     Given The user is viewing a question with answers
//     Then Each answer should display the username of the answerer
//     And Each answer should display when it was posted

Given('The user is viewing a question with answers', () => {
    cy.visit("http://localhost:3000");
    cy.get(".postTitle").first().click();
    cy.get("#answerPaper").should("have.length.at.least", 1);
});

Then('Each answer should display the username of the answerer', () => {
    cy.get("#answerPaper").each(($answer) => {
        cy.wrap($answer).find("#authorName").should("exist");
    });
});

And('Each answer should display when it was posted', () => {
    cy.get("#answerPaper").each(($answer) => {
        cy.wrap($answer).find("#metaInfo").should("exist");
    });
});

// Scenario: Navigate back to questions after viewing answers
//     Given The user is viewing a question with answers
//     When The user clicks on the "Questions" menu item
//     Then The user should see the list of questions

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

Then('The user should see the list of questions', () => {
    cy.get(".question_list").should("exist");
    cy.get(".postTitle").should("have.length.at.least", 1);
});

// Scenario: View answers sorted by newest first
//     Given The user is viewing a question with multiple answers
//     Then The answers should be displayed with the newest first

Given('The user is viewing a question with multiple answers', () => {
    cy.visit("http://localhost:3000");
    cy.get(".postTitle").first().click();
    cy.contains("Answer Question").click();
    fillAnswerForm(newAnswer);
    cy.contains("Post Answer").click();
    cy.get("#answer-0").should("exist");
    cy.get("#answer-1").should("exist");
});

Then('The answers should be displayed with the newest first', () => {
    cy.get("#answer-0").find("#metaInfo").invoke('text').then((firstTimestamp) => {
        cy.get("#answer-1").find("#metaInfo").invoke('text').then((secondTimestamp) => {
            const firstTime = parseFloat(firstTimestamp.match(/\d+/)[0]);
            const secondTime = parseFloat(secondTimestamp.match(/\d+/)[0]);
            
            expect(firstTime).to.be.at.most(secondTime);
        });
    });
});

// Scenario: View a question with no answers
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks on a question that has no answers
//     Then The user should see a message indicating no answers are available

When('The user clicks on a question that has no answers', () => {
    // First add a question that will have no answers
    cy.contains("Ask a Question").click();
    fillForm(questionWithNoAnswers);
    cy.contains("Post Question").click();
    
    // Now find and click on the question we just created
    cy.contains(questionWithNoAnswers.title).click();
});

Then('The user should see a message indicating no answers are available', () => {
    cy.get("#question-answer-content").should("exist");
    cy.get("#answerPaper").should("not.exist");
});