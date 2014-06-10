var goto = require("./utils").goto


describe('Tests', function() {
    'use strict';

    describe('structure', function() {

        beforeEach(goto('/'));

        it('is OK', function() {
            expect(true).toBe(true);
        });
    });
});
