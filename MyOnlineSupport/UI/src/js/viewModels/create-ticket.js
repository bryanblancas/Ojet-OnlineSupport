define(['ojs/ojcore',
	'knockout',
    'jquery',
    'ojs/ojselectcombobox',
    'trumbowyg'
], function (oj, ko, $) {
    function CreateTicketViewModel (params) {
	    var self = this;

	    /*
	    *
	    * VARIABLES
	    *
	    */
	    self.newTicketTitle = ko.observable();
		self.newTicketPriority = ko.observable();

	    // Animation of the create ticket div
	    self.handleAttached = function () {
      		oj.AnimationUtils['slideIn']($('#create-new-ticket')[0], { 'direction': 'bottom' });
      		// Initializing trumbowyg
			$('#new-ticket-area').trumbowyg(
	            {
	                btns: ['bold', 'italic', 'underline'],
	                resetCss: true,
	                removeformatPasted: true
	            }
			);
		}

    }
    return CreateTicketViewModel;
   }
);