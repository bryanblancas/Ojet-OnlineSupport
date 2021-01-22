/*

    CREATED WITH ojet create component inline-search

*/

'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/inline-search-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {
    
    function InlineSearchModel(context) {
        var self = this;
        
        //At the start of your viewModel constructor
        var busyContext = Context.getContext(context.element).getBusyContext();
        var options = {"description": "Web Component Startup - Waiting for data"};
        self.busyResolve = busyContext.addBusyState(options);

        self.composite = context.element;


        // Variable Setup
        self.collectionToBeFiltered = ko.observable(context.properties.data);
        self.persistentModels = [];
        self.filterAttribute = ko.observable(context.properties.filterAttribute);
        self.searchTerm = ko.observable();
        // Prevent the search code from running too many times when a user types quickly
        self.searchTerm.extend({ rateLimit: 500 });

        /* Wait for models to be passed in and when they are assign them to the persistentModels variable */
        self.propertyChanged = function(event){
            if(event.property === 'models'){
                self.persistentModels = event.value;
            }
        }
        
        /* Filter for checking if the entered values matches with one of the model attributes */
        self.valueFilter = function (model, attr, value) {
            var name = model.get(attr);
            return (name.toLowerCase().indexOf(value.toLowerCase()) > -1);
        };

        /* Function to handle the filtering of the collection when a user enters a value into the search box */
        self.searchTerm.subscribe(function (newValue) {
            if (newValue.length == 0) {
                console.log("About to clone original collections as newValue is null")
                var clonedCollection = self.collectionToBeFiltered().clone();
                clonedCollection.reset(self.persistentModels);
                context.properties.data = clonedCollection;
            } 
            else {
                self.collectionToBeFiltered().reset(self.persistentModels);
                var filterObject = {}
                filterObject[self.filterAttribute()] = { value: newValue, comparator: self.valueFilter };
                var ret = self.collectionToBeFiltered().where(filterObject);
                var clonedCollection = self.collectionToBeFiltered().clone()
                clonedCollection.reset(ret);
                context.properties.data = clonedCollection
            }
        });

        //Once all startup and async activities have finished, relocate if there are any async activities
        self.busyResolve();
    };

    InlineSearchModel.prototype._resetSearch = function () {
        this.searchTerm('');
        console.log("HOOALAAAAAAAAAAAAAAAAAAAA");
    };
    
    //Lifecycle methods - uncomment and implement if necessary 
    //InlineSearchModel.prototype.activated = function(context){
    //};

    //InlineSearchModel.prototype.connected = function(context){
    //};

    //InlineSearchModel.prototype.bindingsApplied = function(context){
    //};

    //InlineSearchModel.prototype.disconnected = function(context){
    //};

    //InlineSearchModel.prototype.propertyChanged = function(context){
    //};

    return InlineSearchModel;
});
