define(['ojs/ojcore',
	'knockout',
    'jquery',
    'appUtils',
    'ojs/ojselectcombobox',
    'trumbowyg'
], function (oj, ko, $, appUtils) {
    function CreateTicketViewModel (params) {
	    var self = this;

	    /*
	    *
	    * VARIABLES
	    *
	    */
	    self.newTicketTitle = ko.observable();
		self.newTicketPriority = ko.observable();

		// Variables to storage file picker and information that comes from ticket desk
		self.uploadedFile = ko.observableArray([]);
		self.allowedFileTypes = ko.observableArray(['image/*']);
		self.createNewTicketSignal = params.createNewTicketSignal;
		self.newTicketId = params.newTicketId;
		self.createInProgress = ko.observable(false);


		/* Function to create a new ticket */
		self.createTicket = function () {
            var date = new Date();
            var messageArea = $('#new-ticket-area').trumbowyg('html');
            self.createInProgress(true);
            var newTicket = {
                "id": self.newTicketId,
                "title": self.newTicketTitle(),
                "author": "Charlotte Illidge",
                "representativeId": "1",
                "priority": self.newTicketPriority(),
                "service": "stylearchive",
                "dateCreated": date.toISOString(),
                "status": "New",
                "message": messageArea,
                "attachment": [],
                "ticketRating": -1
            }
            if (self.uploadedFile()[0] != null) {
                appUtils.uploadAttachment(self.newTicketId, self.uploadedFile()[0])
                .then(function (attachment) {
                        newTicket['attachment'] = attachment;
                        self.createNewTicketSignal.dispatch(newTicket);
                    });
                }
            else {
                self.createNewTicketSignal.dispatch(newTicket);
            }
        }
        // When the user selects a file, this fuctions will assing that file
        // to the variable uploadedFile
        self.fileSelectionListener = function (event) {
            var file = event.detail.files;
            self.uploadedFile(file);
        }


	    /*The life cycle event that we need to initialize the editor is going to be handleAttached.
        This is because all we are waiting on is for the DOM to finish loading and the div that
        we need to latch on to being present. Therefore, at this point in the life cycle, the element will be present.*/
	    self.handleAttached = function () {
	    	// Animation of the create ticket div
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