'use strict';

define({
    'query': {
        'filtered': {
            'filter': {
                'and': [
                    {'range': {'_updated': {'gt': 'last-data'}}}
                ]
            }
        }
    }
});
