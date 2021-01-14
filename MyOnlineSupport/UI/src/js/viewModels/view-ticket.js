define(
  ['ojs/ojcore',
    'knockout',
    'jquery',
    'appUtils',
    'ojs/ojlistview',
    'ojs/ojarraydataprovider'
  ],
  function (oj, ko, $, appUtils) {
    function ViewTicketViewModel(params) {
      var self = this;
      // console.log(params.ticketModel());
      /*
      *
      * VARIABLES
      *
      */

      self.ticketId = ko.observable();
      self.title = ko.observable();
      self.author = ko.observable();
      self.dateCreated = ko.observable();
      self.showDateDifference = ko.observable();
      self.message = ko.observable();
      self.status = ko.observable()
      self.attachment = ko.observable();


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


      /* Utils */
      self.formatDate = appUtils.formatDate;   
      console.log(self.formatDate(self.dateCreated()));

    }
  return ViewTicketViewModel;
});