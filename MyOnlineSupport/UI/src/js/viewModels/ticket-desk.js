define(['ojs/ojcore',
        'knockout',
        'jquery',
        'ojs/ojlistview',
        'ojs/ojinputtext',
        'ojs/ojcollectiontabledatasource',
        'ojs/ojarraytabledatasource',
        'ojs/ojmodel',
        'ojs/ojvalidation-datetime'],
 function(oj, ko, $) {
    function TicketDeskViewModel() {

      var self = this;
      self.ticketListDataSource = ko.observable();

      self.serviceURL = 'http://localhost:8080/tickets';
      self.ticketModelItem = oj.Model.extend({
            urlRoot: self.serviceURL,
            parse: self.parseTicket,
            idAttribute: 'id'
      }); 
     
    /**
     * Callback to map attributes returned from RESTful data service to desired view model attribute names
     */
    self.ticketModelItem = function(response) {
        return {
          id: response['id'],
          title: response['title'],
          author: response['author'],
          authorImage: response['authorImage'],
          representativeId: response['representativeId'],
          priority: response['priority'],
          service: response['service'],
          dateCreated: response['dateCreated'],
          status: response['status'],
          message: response['message'],
          ticketRating: response['ticketRating']
        };
    };
            
    var ticketListCollection = new oj.Collection(null, {
      url: "http://localhost:8080/tickets",
      model: self.ticketModelItem
    });

    self.ticketListDataSource(new oj.CollectionTableDataSource(ticketListCollection));


     /* var self = this;

      // Variables
      self.ticketListDataSource = ko.observable();
            
      // Model Objet
      var ticketModelItem = oj.Model.extend({
        idAttribute: 'id'
      });


      // Creating the collection by consuming our fack end point of mockserver
      var ticketListCollection = new oj.Collection(null, {
        url: "http://localhost:8080/tickets",
        model: ticketModelItem
      });

      // Assigned the collection to the list and casting
      self.ticketListDataSource(new oj.CollectionTableDataSource(ticketListCollection));

      // console.log(typeOf ticketListDataSource);
      
      // Utils
      self.formatDate = function (date){
        var formatDate = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter(
            {
              'pattern': 'dd/MM/yyyy'
            }
          );
        return formatDate.format(date)
      }*/

    }
    return TicketDeskViewModel;
  }
);