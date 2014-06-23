var resetApp = require("./fixtures").resetApp ;

// runs before every spec
beforeEach(function(done)
  { //resetApp(done)
  ; var uploadSmthsFixtures = require("./fixtures").uploadSmthsFixtures ;
  ; uploadSmthsFixtures(done)
  }
);

// runs after every spec
afterEach(function()
  {
  }
);
