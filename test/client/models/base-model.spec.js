// TODO: Set a different jshint config for tests and remove the next lines
/*global describe, it, before, beforeEach, after, afterEach, expect */
/*jshint unused: false, -W030, -W024 */
'use strict';

define(['models/base-model'], function(BaseModel) {
    describe('Base model', function() {
        describe('poller', function() {
            console.log('base model');
            it('starts the polling process', function() {
                var model = new BaseModel(),
                var options = {};
                model.poller(options);
                expect(model.Id).to.be('integer');
            });
        });
    });
});
