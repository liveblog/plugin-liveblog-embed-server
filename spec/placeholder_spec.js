var goto = require("./utils").goto


describe('Tests', function() {
    'use strict';

    describe('structure', function() {

        beforeEach(goto('/'));

        it('is OK', function() {
	    console.log("here 'it' started")
            expect(true).toBe(true);
        });
    });
});
