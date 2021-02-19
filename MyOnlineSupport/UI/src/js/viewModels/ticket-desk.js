define(['accUtils',
        'knockout',
        'jquery',
        'ojs/ojarraydataprovider',
        'appUtils',
        'ojs/ojlabel',
        'ojs/ojselectsingle',
        'ojs/ojchart',
        'ojs/ojlistview',
        "ojs/ojmenu",
        "ojs/ojoption"
       ],
  function(accUtils, ko, $,ArrayDataProvider, AppUtils) {
  
    function TicketDeskViewModel() {
      var self = this;  
      var url = "js/store_data.json";

      self.activityDataProvider = ko.observable();

      // Get Activities objects from file using jQuery method and a method to return a Promise
      $.getJSON(url).then(function(data) {
          // Create variable for Activities list and populate using key attribute fetch
          var activitiesArray = data;
          self.activityDataProvider(new ArrayDataProvider(activitiesArray, { keyAttributes: 'id' }));
          console.log(activitiesArray);
        }
      );

      // chart type values array and ArrayDataProvider observable
      var types = [
        { value: 'pie', label: 'Pie' },
        { value: 'bar', label: 'Bar' }
      ];
      self.chartTypes = new ArrayDataProvider(types, { keyAttributes: 'value' });

      // chart selection observable and default value
      self.val = ko.observable("pie");


       // chart data array and  ArrayDataProvider observable
      var chartData = [
        { "id": 0, "series": "Baseball", "group": "Group A", "value": 42 },
        { "id": 1, "series": "Baseball", "group": "Group B", "value": 34 },
        { "id": 2, "series": "Bicycling", "group": "Group A", "value": 55 },
        { "id": 3, "series": "Bicycling", "group": "Group B", "value": 30 },
        { "id": 4, "series": "Skiing", "group": "Group A", "value": 36 },
        { "id": 5, "series": "Skiing", "group": "Group B", "value": 50 },
        { "id": 6, "series": "Soccer", "group": "Group A", "value": 22 },
        { "id": 7, "series": "Soccer", "group": "Group B", "value": 46 }
      ];
      self.chartDataProvider = new ArrayDataProvider(chartData, { keyAttributes: 'id' });  

      self.contextMenuAction = (event) => {
        // For this example, I want to know how many elements has the list in order to create a excel file
        // Since the page only has one list, ID element is known and static (see past commits to dynamic ids)
        var searchid = "#activitiesList";
        var elem = $(searchid)[0];//document.getElementById(searchid);
        
        // Debug
        // console.log(elem[0]);
        console.log(elem.childNodes);

        // In this case I know that the information of the list is in the child node UL, so look for it
        var ul_element = elem.getElementsByTagName("ul")[0];

        // Once in the ul element, I know that the information is inside li elements, so search for that
        var content = "";
        $(ul_element).find("li").each(function(){
          content += this.textContent.replace(/[^a-zA-Z0-9]/g, "").replace("DownloadCSV", "") + ",";
        });
        console.log(content);

        AppUtils.createAndDownloadFile(content, "prueba.csv", "text/csv");
      }

    }

    return TicketDeskViewModel;
  }
);
