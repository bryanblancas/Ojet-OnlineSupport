define(
  [ 
    'accUtils',
    'knockout',
    'jquery',
    'ojs/ojmodel',
    'ojs/ojcollectiondatagriddatasource',
    'ojs/ojdatagrid'
  ],
 function(accUtils, ko, $, Model, CollectionDataGrid) {
    function DownloadDataGridViewModel() {

      self = this;

      var url = "http://localhost:8080/datagrid-demodata"

      self.dataSource = ko.observable();

      // Get the collection
      var collection = new Model.Collection(null, {
        url: url
      });

      // self.dataSource = new CollectionDataGrid.CollectionDataGridDataSource(collection,
      //   { rowHeader: 'EMPLOYEE_ID' }
      // );


      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DownloadDataGridViewModel;
  }
);
