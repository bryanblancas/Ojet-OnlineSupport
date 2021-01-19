define(
  ['ojs/ojcore',
    'knockout',
    'jquery',
    'appUtils',
    'ojs/ojmodel',
    'ojs/ojcollectiondataprovider',
    'trumbowyg',
    'ojs/ojlistview',
    'ojs/ojarraydataprovider',
    'ojs/ojlistitemlayout',
    'ojs/ojselectsingle',
    'ojs/ojfilepicker'
  ],
  function (oj, ko, $, appUtils, Model, CollectionDataProvider) {
    function ViewTicketViewModel(params) {
      var self = this;
      // console.log(params.ticketModel());
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

      self.uploadedFile = ko.observableArray([]);
      self.allowedFileTypes = ko.observableArray(['image/*']);


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
          console.log("Inside ticketRepliessCollection: CustomURL");
          var retObj = {};
          retObj['url'] = "http://localhost:8080/tickets/replies/" + self.ticketId()
          return retObj
        },
        model: self.ticketReplyModel
      });

      self.ticketReplies = new ticketRepliesCollection();
      self.ticketRepliesDataSource(new oj.CollectionTableDataSource(self.ticketReplies));
      
      self.ticketId.subscribe(function(){
        console.log("Inside ticketIdSubscribe");
        self.ticketReplies.fetch();
        /* Clean the text area and the uploadedFile*/
        $('#ticket-reply-area').trumbowyg('empty');
        self.uploadedFile('');
      })


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
        }


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

      /* Promise to call the file upload function 
      This means that the function that calls this function will wait for the response*/
      self.uploadFile = function () {
        console.log("Inside uploadFile");
        return new Promise(
            function (resolve, reject) {
                var file = $( "#fileUpload" ).find( "input" )[0].files[0];
                var data = new FormData();
                data.append("file", file);
                console.log("Inside promise");
                $.ajax({
                    type: "POST",
                    url: "http://localhost:8080/tickets/upload/" + self.ticketId(),                    
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (result) {
                        resolve("success")
                        console.log("File uploaded successfully!");
                    },
                    error: function (err, status, errorThrown) {
                        reject(err);
                        console.error("Error")
                    }
                });
            }
        )
      }

      self.fileSelectionListener = function(event){
        var file = event.detail.files;
        self.uploadedFile(file);
      }

      /*Check it an image has been uploaded*/
      self.ticketReply = function (){
        var date = new Date();
        var attachment = [];

        console.log("Inside ticketReply");

        if(self.uploadedFile()[0] != null){
          console.log("About to upload file");
          self.uploadFile().then(
            function(success){
              attachment = [{
                "filePath": self.uploadedFile()[0].name,
                "fileSize": bytesToSize(self.uploadedFile()[0].size),
                "timestamp": date.toISOString()
              }]
              self.addTicketReplyToCollection(attachment, date);
            })
            .catch(
              function(error){
                console.error("Error uploading file");
            });
        }
        else{
          console.log("No file selected. Add ticketreply");
          self.addTicketReplyToCollection(attachment, date);
        }
      }

      /* Function to build up the ticket reply and add it to the collection */
      self.addTicketReplyToCollection = function(attachment, date){
        console.log("Inside addTicketReplyToCollection");
        var newReply = {
            "author": "Charlotte Illidge",
            "timestamp": date.toISOString(),
            "note": $('#ticket-reply-area').trumbowyg('html'),
            "attachment": attachment
        };
        console.log("Inside addTicketReplyToCollection: before create");
        console.log(newReply);
        self.ticketReplies.create(newReply, {
            wait: true,
            success: function(model, response, options){
                console.log("Success to create ticketReply");
            },
            error: function(err, status, errorThrown){
                console.error("Error");
            }
        });
        console.log("Inside addTicketReplyToCollection: after create");
        $('#ticket-reply-area').trumbowyg('empty');
        self.uploadedFile('');
      }


      /* Utils */
      // Function to format the date
      self.formatDate = appUtils.formatDate;   

      // Function to convert bytes to size
      function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
          var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
          return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      };

      /* Function to automatically scroll the user to the reply editor */
      self.scrollToReply = function(){
        document.getElementById('ticket-reply-area').scrollIntoView();
      }

    }
  return ViewTicketViewModel;
});