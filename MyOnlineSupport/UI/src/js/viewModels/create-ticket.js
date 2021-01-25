define(['ojs/ojcore',
	'knockout',
    'jquery'
], function (oj, ko, $) {
    function CreateTicketViewModel (params) {
	    var self = this;


	    // Animation of the create ticket div
	    self.handleAttached = function () {
      		oj.AnimationUtils['slideIn']($('#create-new-ticket')[0], { 'direction': 'bottom' });
		}

    }
    return CreateTicketViewModel;
   }
);