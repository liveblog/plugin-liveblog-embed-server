var reset_app = require("./fixtures").reset_app ;

beforeEach(function() {
    // runs before every spec
    console.log("begin beforeEach");
    var result = reset_app();
    console.log("end beforeEach");
});

afterEach(function() {
    // runs after every spec
});
