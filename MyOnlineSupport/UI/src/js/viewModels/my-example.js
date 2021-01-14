define(
  ['accUtils',
   'knockout',
   'jquery',
   'ojs/ojmodel',
   'ojs/ojcollectiondataprovider',
   'appUtils',
   'ojs/ojarrayTableDataSource',
   'ojs/ojlistview',
   'ojs/ojselectsingle',
   'ojs/ojlistitemlayout',
   'ojs/ojvalidation-datetime',
   'ojs/ojinputtext'
  ],
  function (accUtils, ko, $, Model, CollectionDataProvider, appUtils)   {
    function myExampleViewModel() {
      var self = this;

      /*
      *
      * VARIABLES
      *
      */

      self.ticketsDataProvider = ko.observable();
      self.selectedTicket = ko.observableArray([]);
      self.selectedTicketModel = ko.observable();
      self.selectedTicketRepId = ko.observable();
      self.tabData = ko.observableArray([]);
      self.selectedBarItem = ko.observable();

      /*
      *
      * GETTING TICKETS
      *
      */

      //REST endpoint
      var RESTurl = "http://localhost:8080/tickets";
      //Single line of data
      var ticketModel = Model.Model.extend({
        urlRoot: RESTurl,
        idAttribute: 'id'
      });
      //Multiple models i.e. multiple lines of data
      self.tickets = new ticketModel();
      var ticketsCollection = new Model.Collection.extend({
         url: RESTurl,
         model: self.tickets,
         comparator: 'id'
      });
      // Generating the ticketDataProvider
      // I'm assinging that ticketList will be a new Observable the aim of this is
      // allow us to access the ticket list collection before it is passed into the collectionTableDataSource
      // If I dont declare ticketList as follow, the ticketDataProvider will throw an error "ticketList"
      // is not a function
      self.ticketList = ko.observable(new ticketsCollection());
      self.ticketsDataProvider(new CollectionDataProvider(self.ticketList()));

      /*
      *
      * TAB BAR CONTROLING
      *
      */

      /* List selection listener */
      self.listSelectionChanged = function () {
          self.selectedTicketModel(self.ticketList().get(self.selectedTicket()[0]));
          // Check if the selected ticket exists within the tab data
          var match = ko.utils.arrayFirst(self.tabData(), function (item) {
            return item.id == self.selectedTicket()[0];
          });
          if (!match) {
            self.tabData.push({
              "name": self.selectedTicket()[0],
              "id": self.selectedTicket()[0]
            });
          }
          self.selectedTicketRepId(self.selectedTicketModel().get('representativeId'));
          self.selectedBarItem(self.selectedTicket()[0]);
        }

      self.tabBarDataSource = new oj.ArrayTableDataSource(self.tabData, { idAttribute: 'id' });

      self.deleteTab = function (id) {
        var hnavlist = document.getElementById('ticket-tab-bar'),
        items = self.tabData();
        for (var i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            self.tabData.splice(i, 1);
            oj.Context.getContext(hnavlist)
              .getBusyContext()
              .whenReady()
              .then(function () {
                hnavlist.focus();
              });
            break;
          }
        }
      };
      self.onTabRemove = function (event) {
        self.deleteTab(event.detail.key);
        event.preventDefault();
        event.stopPropagation();
      };


      /* Utils */
      self.formatDate = appUtils.formatDate;
    }
    return myExampleViewModel;
  }
);
