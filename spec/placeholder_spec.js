/*global describe, beforeEach, expect, it */

var gotoUri = require('./helpers/liveblog_common').gotoUri;

describe('Tests', function() {
    'use strict';

    describe('structure', function() {
        beforeEach(
            function() {
                gotoUri('/');
            }
        );

        it('is OK', function() {
            console.log('here "it" started');
            console.log(protractor.getInstance().params.fixtures);
            expect(true).toBe(true);
        });

    // 'structure' describe end
    });

// 'Tests' root describe end
});
