define(
  ['accUtils',
   'knockout',
   'jquery',
   'ojs/ojmodel',
   'ojs/ojcollectiondataprovider',
   'appUtils',
   'signals',
   'ojs/ojarrayTableDataSource',
   'ojs/ojlistview',
   'ojs/ojselectsingle',
   'ojs/ojlistitemlayout',
   'ojs/ojvalidation-datetime',
   'ojs/ojinputtext',
   'inline-search/loader'
  ],
  function (accUtils, ko, $, Model, CollectionDataProvider, appUtils, signals)   {
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

      // Signals to manage events to the tickets
      self.closeTicketSignal = new signals.Signal();
      self.updatePrioritySignal = new signals.Signal();

      // For search component
      self.persistentModels = ko.observableArray();
      self.filterAttribute = 'title';
      self.selectionRequired = ko.observable(true);

      // For creation of tickets
      self.createVisible = ko.observable(false)
      self.newTicketId = '';
      self.createNewTicketSignal = new signals.Signal();

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
      * Getting collection for search component
      *
      */
      self.ticketList().fetch({
        success: function success(data) {
            self.persistentModels(data.models);
        }
      });

      self.updateDataSource = function(event){
         self.selectionRequired(false);
         self.ticketsDataProvider(new CollectionDataProvider(self.ticketList()));
         var busyContext = oj.Context.getPageContext().getBusyContext();
         busyContext.whenReady().then(function () {
          self.selectionRequired(true);
         });
      }

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
          document.getElementById("search-component").resetSearch();       
        }


     /*
      *
      * TAB BAR CONTROLING
      *
      */

      self.tabBarDataSource = new oj.ArrayTableDataSource(self.tabData, { idAttribute: 'id' });

      self.tabSelectionChanged = function () {
        if(self.ticketList().get(self.selectedBarItem()) === undefined){
            document.getElementById("search-component").resetSearch();
        }
        oj.Context.getContext(document.getElementById("search-component"))
        .getBusyContext()
        .whenReady()
        .then(function () {
           self.selectedTicketModel(self.ticketList().get(self.selectedBarItem()))
           self.selectedTicket([self.selectedBarItem()])
        })
      }

      self.deleteTab = function (id) {
        var hnavlist = document.getElementById('ticket-tab-bar');
        items = self.tabData();
        for (var i = 0; i < items.length; i++) {
          if(id != self.persistentModels()[0].get('id')){
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


      /*
      *
      * CREATION PF TICKETS
      *
      */

      
      // Toggle the state of the create ticket module
      self.toggleCreateTicket = function () {
        if(self.createVisible() == true)
          self.createVisible(false);
        else
          self.createVisible(true);
      }

      /*
      * Logic for signals
      * These functions are executed each time that in view-ticket.js occurs a dispatch
      */

      /* Priority update listener, when a dispatch signal is sent, the priority is increased and the model item updated */
      self.updatePrioritySignal.add(function(ticketId) {
        var newPriority;
        var modelItem = self.ticketList().get(ticketId);
        var modelData = modelItem.attributes;
        newPriority = modelData.priority - 1;
        var updatedData = {
          id: modelData.id,
          priority: newPriority
        };
        modelItem.save(updatedData, {
          wait: true,
          success: function (model, response, options) {
            self.selectedTicketModel(self.ticketList().get(self.selectedTicket()[0]))
          },
          error: function (jqXHR) {
          }
        });
      });

      /* Close ticket listener, when a dispatch signal is sent, the new object with closed status is created and the model item is updated */
      self.closeTicketSignal.add(function(ticketId, closureReason) {
        var modelItem = self.ticketList().get(ticketId);
        var modelData = modelItem.attributes;
        var updatedData = {
          id: modelData.id,
          status: 'Closed',
          closureReason: closureReason
        };
        modelItem.save(updatedData, {
          wait:true,
          success: function (model, response, options) {
            self.selectedTicketModel(self.ticketList().get(self.selectedTicket()[0]))
          },
          error: function (jqXHR) {
          }
        });
      })



      /* Utils */
      self.formatDate = appUtils.formatDate;
    }
    return myExampleViewModel;
  }
);
