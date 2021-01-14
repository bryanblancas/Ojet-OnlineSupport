define(
  ['accUtils',
   'knockout',
   'jquery',
   'ojs/ojmodel',
   'ojs/ojcollectiondataprovider',
   'ojs/ojarrayTableDataSource',
   'ojs/ojlistview',
   'ojs/ojselectsingle',
   'ojs/ojlistitemlayout',
   'ojs/ojvalidation-datetime',
   'ojs/ojinputtext'
  ],
  function (accUtils, ko, $, Model, CollectionDataProvider)   {
    function myExampleViewModel() {
      var self = this;

      /*Variables*/
      self.ticketsDataProvider = ko.observable();
      self.selectedBarItem = ko.observable();
      

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
      self.myTicketCol = new ticketsCollection();
      self.ticketsDataProvider(new CollectionDataProvider(self.myTicketCol));

      
      /* Tab Component */
      self.tabData = ko.observableArray(
        [
          {
            name: 'Settings',
            id: 'settings'
          },
          {
            name: 'Tools',
            id: 'tools'
          },
          {
            name: 'Base',
            id: 'base'
          },
          {
            name: 'Environment',
            disabled: 'true',
            id: 'environment'
          },
          {
            name: 'Security',
            id: 'security'
          }
        ]
      );
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
      self.formatDate = function (date){
        var formatDate = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter(
            {
              'pattern': 'dd/MM/yyyy'
            }
          );
        return formatDate.format(date)
      }
    }
    return myExampleViewModel;
  }
);
