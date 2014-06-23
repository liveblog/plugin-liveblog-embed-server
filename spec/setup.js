var resetApp = require("./fixtures").resetApp ;

// runs before every spec
beforeEach(function(done)
  { //resetApp(done)
  ; var uploadSmthsFixtures = require("./fixtures").uploadPostFixtures ;
  ; uploadSmthsFixtures(done, 2)
  }
);

// runs after every spec
afterEach(function()
  {
  }
);
