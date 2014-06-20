var reset_app = require("./fixtures").reset_app ;

// runs before every spec
beforeEach(function(done)
  { reset_app(done)
  }
);

// runs after every spec
afterEach(function()
  {
  }
);
