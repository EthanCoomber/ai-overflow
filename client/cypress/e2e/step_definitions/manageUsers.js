import { Given, When, Then, And, Before, After } from 'cypress-cucumber-preprocessor/steps';

const generateRandomPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    // Ensure at least one character from each category
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));
    
    // Add more random characters to reach desired length (16 characters total)
    const allChars = lowercase + uppercase + numbers + special;
    for (let i = 0; i < 12; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36);
    password += timestamp.substring(timestamp.length - 4);
    
    // Shuffle the password characters
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
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36).substring(2, 7);
    
    return `${randomAdjective}${randomNoun}${numbers}_${timestamp}`;
};

// Test user data
const testUser = {
    username: generateRandomUsername(),
    email: `test_${Date.now()}@example.com`, // Add timestamp to email for uniqueness
    password: generateRandomPassword(),
    weakPassword: 'weak'
};

// Scenario: Successful Account Creation
Given('I am a new user to the platform', () => {
    cy.visit('http://localhost:3000/signup');
});

When('I provide a valid username and password', () => {
    cy.get('#username').type(testUser.username);
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('#signup-button').click();
});

Then('my account should be successfully created', () => {
    cy.url().should('include', '/');
});

// Scenario: Duplicate Email or Username Error
Given('I am attempting to create a new account', () => {
    cy.visit('http://localhost:3000/signup');
});

When('I provide a username that already exists', () => {
    // First create a user
    cy.get('#username').type(testUser.username);
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('#signup-button').click();
    
    // Wait for the account creation to complete
    cy.url().should('include', '/');
    
    // Logout if needed
    cy.contains('Logout').click();
    
    // Then try to create another with the same username
    cy.visit('http://localhost:3000/signup');
    cy.get('#username').type(testUser.username);
    cy.get('#email').type('another' + testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('#signup-button').click();
});

Then('I should receive an error indicating the conflict', () => {
    cy.get('#signup-error').should('contain', 'User with this email or username already exists');
});

// Scenario: Password Strength Validation
Given('I am creating a new account', () => {
    cy.visit('http://localhost:3000/signup');
});

When('I enter a weak password', () => {
    cy.get('#username').type('newuser');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type(testUser.weakPassword);
    cy.get('#signup-button').click();
});

Then('I should receive an error requesting a stronger password', () => {
    cy.get('#password-error').should('contain', 'Password must be at least 6 characters long');
});

// Scenario: Successful Login
Given('I am a registered user', () => {
    cy.visit('http://localhost:3000/signup');
    cy.get('#username').type(testUser.username);
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('#signup-button').click();
    cy.contains('Logout').click();
});

When('I provide my correct username and password', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('.login-button').click();
});

Then('I should be successfully logged in and redirected to my dashboard', () => {
    cy.url().should('include', '/');
});

// Scenario: Incorrect Login Details
Given('I am a registered user with an account', () => {
    // Reuse the registered user from previous scenario
    cy.visit('http://localhost:3000/login');
});

When('I enter an incorrect username or password', () => {
    cy.get('#email').type(testUser.email);
    cy.get('#password').type('wrongpassword');
    cy.get('.login-button').click();
});

Then('I should see an error message indicating invalid credentials', () => {
    cy.contains('Invalid credentials or server error').should('be.visible');
});