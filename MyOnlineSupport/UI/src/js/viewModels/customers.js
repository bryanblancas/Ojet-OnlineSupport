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
define(['ojs/ojcore',
        'accUtils'],
 function(oj, accUtils) {
    function CustomerViewModel() {
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      var information = null;

      self.onButtonPressed = function(){
        information = document.getElementById("information").textContent;
        let test = `nombre,atributo 1,atributo 2,atributo 3
        Bryan,HOLA,ASDF,asdf
        Israel,asdf,asdf,asdf
        Blancas,5361,566,xxx`;
        createAndDownloadFile(information, "prueba.csv", "text/csv");
      }


      self.createAndDownloadFile = function(data, name, type){
      
        /******************************** 
         * Create the file object (blob)
        *********************************/
        // https://developer.mozilla.org/es/docs/Web/API/Blob/Blob
        // https://www.iana.org/assignments/media-types/media-types.xhtml#text
        let file = new Blob([data], {type: type});

        /******************************** 
         * Create the object URL
        *********************************/
        // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
        let url = URL.createObjectURL(file);

        /******************************** 
         * Create dummy element a to download the file
         * with the attribute 'download'
        *********************************/
        let a = document.createElement("a");
        // Assign the URL object to the new tag 'a' just created
        a.href = url;
        // Download attribute specifies that the target 
        // will be downloaded when a user clicks on the hyperlink
        a.download = name;
        // Manually 'click' the hyperlink
        a.click();

        // Release the url object
        URL.revokeObjectURL(url);
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
