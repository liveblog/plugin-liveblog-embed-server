'use strict';

exports.goto = goto;


// go to uri
function goto(uri) {
    return function() {
        browser.driver.get(protractor.getInstance().baseUrl+uri);
	console.log(protractor.getInstance().baseUrl+uri)
    };
}
