'use strict';

define({
    "query": {
        "filtered": {
            "filter": {
                "and": [{
                    "not": {
                        "term": {
                            "deleted": true
                        }
                    }
                }, {
                    "range": {
                        "_updated": {
                            "gt": "last-data"
                        }
                    }
                }]
            }
        }
    }
});
