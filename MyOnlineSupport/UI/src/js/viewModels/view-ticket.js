define(
  ['ojs/ojcore',
    'knockout',
    'jquery',
    'appUtils',
    'ojs/ojmodel',
    'ojs/ojcollectiondataprovider',
    'ojs/ojlistview',
    'ojs/ojarraydataprovider',
    'ojs/ojlistitemlayout',
    'ojs/ojselectsingle'
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


      /*
      *
      * To computed each change to the params
      *
      */

      self.ticketModel = ko.computed(function () {
              self.ticketId(params.ticketModel().get('id'))
              self.title(params.ticketModel().get('title'))
              self.author(params.ticketModel().get('author'))
              self.dateCreated(params.ticketModel().get('dateCreated'))
              self.message(params.ticketModel().get('message'))
              self.status(params.ticketModel().get('status'))
              self.attachment(params.ticketModel().get('attachment'))
              return params.ticketModel();
      });

      /*
      *
      * To get the collection of replies
      *
      */

      /*
      MY TRY
      var repliesUrl = ko.computed( function(){
        return "http://localhost:8080/tickets/replies/" + self.ticketId()
      });

      var ticketReplyModel = Model.Model.extend({
        urlRoot: repliesUrl,
        idAttribute: 'id'
      });

      self.replies = new ticketReplyModel();
      var repliesCollection = new Model.Collection.extend({
         url: repliesUrl,
         model: self.replies,
         comparator: 'id'
      });

      self.repliesList = ko.observable(new repliesCollection());
      self.ticketRepliesDataSource(new CollectionDataProvider(self.repliesList()));

      self.ticketId.subscribe(function(){
        self.repliesList.fetch();
      })*/

       /* List View Collection and Model */
      self.ticketRepliesDataSource = ko.observable();
      self.ticketReplyModel = oj.Model.extend({
        idAttribute: 'id'
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

      /* Utils */
      self.formatDate = appUtils.formatDate;   
      console.log(self.formatDate(self.dateCreated()));

    }
  return ViewTicketViewModel;
});