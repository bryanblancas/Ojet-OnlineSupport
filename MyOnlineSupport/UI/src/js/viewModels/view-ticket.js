define(
  ['ojs/ojcore',
    'knockout',
    'jquery',
    'appUtils', // My Utils File
    'ojs/ojmodel', // To make models for thw collection
    'ojs/ojcollectiondataprovider', // To consume the API
    'signals', // Pass information between oj modules
    'trumbowyg', // Lovely Text Area 
    'ojs/ojlistview', // List View
    'ojs/ojarraydataprovider',
    'ojs/ojlistitemlayout', // Item of List View
    'ojs/ojselectsingle',
    'ojs/ojfilepicker', // File Picker
    'ojs/ojselectcombobox', 
    'ojs/ojlabel',
    'ojs/ojdialog', // Modal Dialog
    'ojs/ojgauge' // Rating Stars
  ],
  function (oj, ko, $, appUtils, Model, CollectionDataProvider, signals) {
    function ViewTicketViewModel(params) {
      var self = this;

      /*
      *
      * VARIABLES
      *
      */

      self.ticketRepliesDataSource = ko.observable();

      self.ticketId = ko.observable();
      self.title = ko.observable();
      self.author = ko.observable();
      self.dateCreated = ko.observable();
      self.showDateDifference = ko.observable();
      self.message = ko.observable();
      self.status = ko.observable()
      self.attachment = ko.observable();
      self.closedTicketRatingValue = ko.observable();

      
      // Variables to storage reply information
      self.uploadedFile = ko.observableArray([]);
      self.allowedFileTypes = ko.observableArray(['image/*']);

      /*
      Variables to manage signals
        Assign local signal variables to those that have came in params
      */
      self.closeTicketSignal = params.closeTicketSignal;
      self.updatePrioritySignal = params.updatePrioritySignal;
      // Messages should also be set up for ticket replies, but as this 
      // functionality is within a different module from the one in which the 
      // applicationMessages array is defined, we must use a signal 
      // to inform the ticket-desk ViewModel of any activity
      self.ticketReplyFailure = params.ticketReplyFailure

      // Variables to store priority of the ticket and the reason of the closure
      self.priority = ko.observable();
      self.closureReason = ko.observable();

      /*
      *
      * To computed each change to the params
      *
      */

      self.ticketModel = ko.computed(function () {
              self.ticketId(params.ticketModel().get('id'));
              self.title(params.ticketModel().get('title'));
              self.author(params.ticketModel().get('author'));
              self.dateCreated(params.ticketModel().get('dateCreated'));
              self.message(params.ticketModel().get('message'));
              self.status(params.ticketModel().get('status'));
              self.attachment(params.ticketModel().get('attachment'));
              self.priority(params.ticketModel().get('priority'));
              self.priority(params.ticketModel().get('priority'));
              self.closedTicketRatingValue(params.ticketModel().get('ticketRating'));
              return params.ticketModel();
      });

      /*
      *
      * To get the collection of replies
      *
      */

       /* List View Collection and Model */
      self.ticketRepliesDataSource = ko.observable();

      /* Include the customURL attribute. This is required, so the model knows which end point to call when adding a new item*/
      self.ticketReplyModel = oj.Model.extend({
        idAttribute: 'id',
        customURL: function () {
          var retObj = {};
          retObj['url'] = "http://localhost:8080/tickets/replies/" + self.ticketId()
          return retObj
        }
      });

      var ticketRepliesCollection = oj.Collection.extend({
        customURL: function () {
          var retObj = {};
          retObj['url'] = "http://localhost:8080/tickets/replies/" + self.ticketId()
          return retObj
        },
        model: self.ticketReplyModel
      });

      self.ticketReplies = new ticketRepliesCollection();
      self.ticketRepliesDataSource(new oj.CollectionTableDataSource(self.ticketReplies));
      
      self.ticketId.subscribe(function(){
        self.ticketReplies.fetch();
        /* Clean the text area and the uploadedFile*/
        $('#ticket-reply-area').trumbowyg('empty');
        self.uploadedFile('');
      })

      /* Function to initialize the trumbowyg (textarea with more functions)*/
      /*The life cycle event that we need to initialize the editor is going to be handleAttached.
        This is because all we are waiting on is for the DOM to finish loading and the div that
        we need to latch on to being present. Therefore, at this point in the life cycle, the element will be present.*/
      self.handleAttached = function () {
          $('#ticket-reply-area').trumbowyg(
            {
              btns: ['bold', 'italic', 'underline'], // Determine which options are available in the textarea
              resetCss: true, // prevents any page CSS interfering with the editor
              removeformatPasted: true //prevents any pasted formatting from being applied
            }  
          );
        };


      self.fileSelectionListener = function(event){
        var file = event.detail.files;
        self.uploadedFile(file);
      }

      /*Check it an image has been uploaded*/
      self.ticketReply = function (){
        var date = new Date();
        var attachment = [];
        if(self.uploadedFile()[0] != null){
          appUtils.uploadAttachment(self.ticketId, self.uploadedFile()[0])
          .then(function (attachment){
            attachment = attachment;
            self.addTicketReplyToCollection(attachment, date);
          })
          .catch(function (error){
            oj.Logger.error('Error creating new ticket: ' + err.status + ' ' + err.statusText);
            // Dispatch the signal to perform the actions defined in my-example.js
            self.ticketReplyFailure.dispatch();
          })
        }
        else{
          self.addTicketReplyToCollection(attachment, date);
        }
      }

      /* Function to build up the ticket reply and add it to the collection */
      self.addTicketReplyToCollection = function(attachment, date){
        var newReply = {
            "author": "Charlotte Illidge",
            "timestamp": date.toISOString(),
            "note": $('#ticket-reply-area').trumbowyg('html'),
            "attachment": attachment
        };
        self.ticketReplies.create(newReply, {
            wait: true,
            success: function(model, response, options){
            },
            error: function(err, status, errorThrown){
              oj.Logger.error('Error creating new ticket: ' + err.status + ' ' + err.statusText);
              // Dispatch the signal to perform the actions defined in my-example.js
              self.ticketReplyFailure.dispatch();
            }
        });
        $('#ticket-reply-area').trumbowyg('empty');
        self.uploadedFile('');
      }

      /*Event of close ticket and change priority*/
      /* Functions to close a ticket via a signal to the ticket desk VM */
      self.confirmCloseDialog = function (event) {
            document.getElementById('close-confirmation-dialog').open();
      }
      self.closeDialog = function (event) {
            document.getElementById('close-confirmation-dialog').close();
      }
      self.closeTicket = function() {
             self.closeTicketSignal.dispatch(self.ticketId(),self.closureReason());
             self.closeDialog();
      }
      /* Function to escalate a ticket via a signal to the ticket desk VM */
      self.escalatePriority = function() {
             // Only send the signal if the priority is lower than 1
             if(self.priority() > 1){
                self.updatePrioritySignal.dispatch(self.ticketId());
             }
      }


      /*Managing Rating*/
      self.ratingValueChanged = function(event) {
        self.closedTicketRatingValue(event.detail['value']);  
      } 


      /* Utils */
      // Function to format the date
      self.formatDate = appUtils.formatDate;   

      /* Function to automatically scroll the user to the reply editor */
      self.scrollToReply = function(){
        document.getElementById('ticket-reply-area').scrollIntoView();
      }

      /* Function to calculate date ranges */
      self.dateDifference = function (date) {
          var todaysDate = new Date();
          var messageDate = new Date(date);
          var res = Math.abs(todaysDate - messageDate) / 1000;
          var days = Math.floor(res / 86400);
          if (days < 1)         return "Less than a day ago";
          else if (days === 1)  return "A day ago";
          else if (days <= 7)   return "Less than a week ago";
          else if (days > 7 && days <= 30) return "More than a week ago";
          else if (days > 30)   return "More than a month ago";
        }

      /* Function to get ticket status */
      self.ticketStatus = function (status) {
          if (status === "Working") 
            return "Ticket status currently 'working', our team are hard at work looking into your issue.";
          else if (status === "Closed") 
            return "Ticket status is 'closed', and is now in read-only mode. In order to help us continue to offer the best support we can, please rate your experience.";
          else if (status === "Awaiting Customer Response") 
            return "Ticket status is currently 'awaiting customer response', our team is awaiting your reply.";
          else if (status === "New") {
            return "This is a new ticket that will be looked into shortly by a member of the team. Please check back soon.";
}
        }


    }
  return ViewTicketViewModel;
});