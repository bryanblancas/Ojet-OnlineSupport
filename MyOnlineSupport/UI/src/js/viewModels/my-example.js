define(
  ['accUtils',
   'knockout',
   'ojs/ojmodel',
   'ojs/ojcollectiondataprovider',
   'ojs/ojlabel',
   'ojs/ojchart',
   'ojs/ojlistview',
   'ojs/ojavatar'
  ],
  function (accUtils, ko, Model, CollectionDataProvider)   {
    function myExampleViewModel() {
      var self = this;
      self.activityDataProvider = ko.observable();
      
      //REST endpoint
      var RESTurl = "http://localhost:8080/tickets";

      //Single line of data
      var activityModel = Model.Model.extend({
        urlRoot: RESTurl,
        idAttribute: 'id'
      });

      //Multiple models i.e. multiple lines of data
      self.myActivity = new activityModel();
      var activityCollection = new Model.Collection.extend({
         url: RESTurl,
         model: self.myActivity,
         comparator: 'id'
      });

      /*
      *An observable called activityDataProvider is already bound in the View file
      *from the JSON example, so you don't need to update dashboard.html
      */
      self.myActivityCol = new activityCollection();
      self.activityDataProvider(new CollectionDataProvider(self.myActivityCol));

    }
    return myExampleViewModel;
  }
);
