// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

beforeEach(() => {
	cy.intercept('POST', '**/api/login', {
		statusCode: 200,
		body: {
			token: 'fake-jwt-token',
			roles: ['ROLE_STUDENT'],
			userId: 1,
			username: 'user@test.com'
		}
	}).as('login');

	cy.intercept('GET', '**/notes', {
		statusCode: 200,
		body: []
	}).as('getNotes');

	cy.intercept('GET', '**/api/content/**', (req) => {
		const key = req.url.split('/api/content/')[1]?.split('?')[0] || 'content';
		req.reply({ statusCode: 200, body: { key, value: 'Contenu de test' } });
	});
});
