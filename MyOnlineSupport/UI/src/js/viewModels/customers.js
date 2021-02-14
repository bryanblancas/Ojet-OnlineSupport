/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define([
      'accUtils',
      'knockout',
      'jquery',
      'ojs/ojmodel',
      'ojs/ojcollectiondataprovider',
      'appUtils',
      'ojs/ojmessages'],
  function (accUtils, ko, $, Model, CollectionDataProvider, appUtils)   {
    function CustomerViewModel() {
      self = this;

      self.data = null;
      self.url = "http://localhost:8080/consumeJSON";

      self.applicationMessages = ko.observableArray([]);

      // Ajax call to consume the JSON
      $.ajax({
          dataType: "json",
          url: self.url,
          data: self.data,
          success: function(data){
            self.applicationMessages.push(
              {
                severity: 'confirmation',
                summary: 'JSON data fetched',
                detail: 'Data for the file was succesfully downloaded'
              }
            )
            self.data = data;
          },
          error: function(){
            self.applicationMessages.push(
              {
                severity: 'error',
                summary: 'Error consuming end point',
                detail: 'Unable to get JSON data'
              }
            )
          }
        });

      // Event of the button
      self.onButtonPressed = function(){
        // Form csv
        let fileContent = appUtils.JSONtoCSV(self.data);
        // Create and download the file
        appUtils.createAndDownloadFile(fileContent, "prueba.csv", "text/csv");

      }

      

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = () => {
        accUtils.announce('Customers page loaded.', 'assertive');
        document.title = "Customers";
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
    return CustomerViewModel;
  }
);
