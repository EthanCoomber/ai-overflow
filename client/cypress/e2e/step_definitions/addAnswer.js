import { Given, When, Then, And, Before, After } from 'cypress-cucumber-preprocessor/steps';

const newAnswer = {
    text: "This is a sample answer to the question. It provides helpful information and explains the solution clearly.",
    user: "answerGuru123"
};

const generateRandomPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));

    const allChars = lowercase + uppercase + numbers + special;
    for (let i = 0; i < 12; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    const timestamp = Date.now().toString(36);
    password += timestamp.substring(timestamp.length - 4);
    
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

const generateRandomUsername = () => {
    const adjectives = ['happy', 'clever', 'brave', 'mighty', 'swift', 'calm', 'wise', 'gentle', 
                        'bold', 'agile', 'keen', 'noble', 'proud', 'quick', 'sharp', 'smart'];
    const nouns = ['tiger', 'eagle', 'wolf', 'lion', 'falcon', 'dolphin', 'panda', 'phoenix',
                  'dragon', 'shark', 'bear', 'hawk', 'whale', 'jaguar', 'raven', 'cobra'];
    const numbers = Math.floor(Math.random() * 10000);
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const timestamp = Date.now().toString(36).substring(2, 7);
    
    return `${randomAdjective}${randomNoun}${numbers}_${timestamp}`;
};

const testUser = {
    username: generateRandomUsername(),
    email: `test_${Date.now()}@example.com`,
    password: generateRandomPassword()
};

Before(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
    cy.exec("npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so");
    
    cy.visit("http://localhost:3000/signup");
    cy.get("#username").type(testUser.username, { parseSpecialCharSequences: false });
    cy.get("#email").type(testUser.email, { parseSpecialCharSequences: false });
    cy.get("#password").type(testUser.password, { parseSpecialCharSequences: false });
    cy.get("#signup-button").click();
    
    cy.url().should('eq', 'http://localhost:3000/');
});

After(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
});

function fillAnswerForm(a) {
    if (a.text)
        cy.get('#answer-text-input').type(a.text, { parseSpecialCharSequences: false });
    if (a.user)
        cy.get('#answer-username-input').type(a.user, { parseSpecialCharSequences: false });
}

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
});

When('The user navigates to a question page', () => {
    cy.get("#question-title").first().click();
});

And('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

And('The user enters valid answer text', () => {
    fillAnswerForm({ text: newAnswer.text });
});

And('The user enters a valid username', () => {
    fillAnswerForm({ user: newAnswer.user });
});

Then('The user should see the new answer in the question page', () => {
    cy.get("#answerText").should("contain", newAnswer.text);
});

And('The answer should display correct metadata information', () => {
    cy.get("#authorName").should("contain", newAnswer.user);
    cy.get("#metaInfo").should("contain", "0 seconds");
});

And('The user leaves the answer text empty', () => {
    // Leave the field empty
});

And('The user leaves the username field empty', () => {
    // Leave the field empty
});
