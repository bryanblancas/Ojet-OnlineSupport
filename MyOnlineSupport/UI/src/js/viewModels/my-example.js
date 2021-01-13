define(['accUtils',
        'knockout',
        'jquery',
        'ojs/ojarraydataprovider',
        'ojs/ojarrayTableDataSource',
        'ojs/ojselectsingle',
        'ojs/ojlistview',
        'ojs/ojavatar',
        'ojs/ojlistitemlayout',
        'ojs/ojtable',
        'ojs/ojvalidation-datetime',
        'ojs/ojinputtext'
       ],  
  function(accUtils, ko, $, ArrayDataProvider)  {
    function myExampleViewModel() {
      var self = this;
      self.dataProvider = ko.observable();
      
      /*
      IF I CONSUME THE ENDPOINT THE LIST DOESN'T SHOW ITEMS
      I DON'T KNOW WHY
      self.data = ko.observableArray();
      $.getJSON("http://localhost:8080/tickets").
        then( function(tickets){
          $.each(tickets, function() {
            self.data.push({
              id: this.id,
              name: this.name,
              title: this.title,
              image: this.image
            });
          });
        });*/

      self.data = [
        {
          "id": 10006,
          "title": "Website Unavailable",
          "author": "Charlotte Illidge",
          "authorImage": "image.jpg",
          "representativeId": "1",
          "priority": 1,
          "service": "stylearchive",
          "dateCreated": "2018-07-12T16:20:47+00:00",
          "status": "Working",
          "message": "Hi, My website (thestylearchive) is currently down and I cannot access it. I can successfully log in to the back end systems but not the actual website.<br /><br />I have tried on multiple devices and internet connections but none seems to work. <br /><br /> Could you please help?<br /><br /> Thanks!",
          "attachment":  [{
              "filePath": "images/websitedown.jpg",
              "fileSize": "87KB",
              "timestamp": "2018-07-12T16:20:47+00:00"
          }],
          "ticketRating": -1
        },
        {
          "id": 10005,
          "title": "Account Upgrade",
          "author": "Charlotte Illidge",
          "authorImage": "image.jpg",
          "representativeId": "2",
          "priority": 3,
          "service": "stylearchive",
          "dateCreated": "2018-07-09T08:37:17+00:00",
          "status": "Closed",
          "message": "Hi, <br /><br />I would like to upgrade my account to the next tier, so that I can include custom HTML in my templates, thanks!",
          "attachment": [],
          "ticketRating": 4
        },
        {
          "id": 10004,
          "title": "Advertisements",
          "author": "Charlotte Illidge",
          "authorImage": "image.jpg",
          "representativeId": "3",
          "priority": 3,
          "service": "stylearchive",
          "dateCreated": "2018-06-25T14:54:17+00:00",
          "status": "Closed",
          "message": "Hi, <br /><br />I would like to include AdSense advertisements on my website, but I cannot seem to find a way to do this. <br /><br />Is this possible? <br /><br />Thanks.",
          "attachment": [],
          "ticketRating": 5
        },
        {
          "id": 10003,
          "title": "Data Migration",
          "author": "Charlotte Illidge",
          "authorImage": "image.jpg",
          "representativeId": "4",
          "priority": 3,
          "service": "stylearchive",
          "dateCreated": "2018-06-11T11:22:16+00:00",
          "status": "Closed",
          "message": "Hi, I need to transfer all my data from my old provider to you. <br /><br />I have a copy of the SQL dump. <br /><br />How do I import this? <br /><br />Thanks,<br /> Charlotte.",
          "attachment": [],
          "ticketRating": 4
        },
        {
          "id": 10002,
          "title": "Importing Image",
          "author": "Charlotte Illidge",
          "authorImage": "image.jpg",
          "representativeId": "5",
          "priority": 3,
          "service": "stylearchive",
          "dateCreated": "2018-06-11T17:20:24+00:00",
          "status": "Awaiting Customer Response",
          "message": "Hi,<br /><br /> I have recently moved over to using your services from my old hosting company. I have a lot of images hosted externally on image upload websites that I would like to migrate over to here.<br /><br />Do you have any tools to support with this? If not would you be able to point me in the right direction?<br /><br /> Many thanks!",
          "attachment": [],
          "ticketRating": -1
        },
        {
          "id": 10001,
          "title": "Domain Transfer",
          "author": "Charlotte Illidge",
          "authorImage": "image.jpg",
          "representativeId": "6",
          "priority": 2,
          "service": "stylearchive",
          "dateCreated": "2018-06-11T17:22:29+00:00",
          "status": "Closed",
          "message": "Hi, Could I please get all the DNS information so that I can point my domain name to your servers please? <br /><br />Can you also assign my domain thestylearchive.co.uk to my account here too? <br /><br />Many thanks!",
          "attachment": [],
          "ticketRating": 5
        }
      ];

      
      self.dataProvider(new oj.ArrayTableDataSource(self.data, { keyAttributes: 'id' }));


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
    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return myExampleViewModel;
  }
);
