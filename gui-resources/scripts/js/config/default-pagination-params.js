'use strict';

define({

    page: 1,

    // Number of items per page
    max_results: 15,
    source: {
        'query': {
            'filtered': {
                'filter': {
                    'and': [
                        {'not':{'term':{'deleted':true}}},
                        {'term': {'post_status': 'open'}}
                    ]
                }
            }
        }
    }
});
