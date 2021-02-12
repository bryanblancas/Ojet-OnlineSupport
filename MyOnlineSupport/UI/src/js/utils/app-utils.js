define([
  'knockout',
  'ojs/ojvalidation-datetime'
  ],
  function (ko) {
    function appUtils() {
      var self = this;

      // Function to get CSV from JSON
      self.JSONtoCSV = function(jsonData){
        // specify how you want to handle null values here
        const replacer = (key, value) => value === null ? '' : value;

        // To headers only get the keys from the first element of the jsonData
        const header = Object.keys(jsonData[0]);

        // Using map, map every element in the json object to his respective place
        let csv = jsonData.map(
            row => header.map(
              fieldName => JSON.stringify(row[fieldName], replacer)
            ).join(',')
          );

        csv.unshift(header.join(','));
        
        csv = csv.join('\r\n');

        return csv;
      }

      // Function to create and download a file with the given data 
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

      /* Function to upload the new attachment and return a promise */
      self.uploadAttachment = function (ticketId, uploadedFile) {
          var date = new Date();
          var attachment = [];
          return new Promise(
              function (resolve, reject) {
                  var file = $("#fileUpload").find("input")[0].files[0];
                  var data = new FormData();
                  data.append("file", file);
                  $.ajax({
                      type: "POST",
                      url: "http://localhost:8080/tickets/upload/" + ticketId,
                      contentType: false,
                      processData: false,
                      data: data,
                      success: function (result) {
                          attachment = [{
                              "filePath": uploadedFile.name,
                              "fileSize": self.bytesToSize(uploadedFile.size),
                              "timestamp": date.toISOString()
                          }]
                          resolve(attachment)
                      },
                      error: function (err, status, errorThrown) {
                          reject(err);
                          console.error("Error")
                      }
                  });
              }
          );
      }

      /*
      Source: http://codeaid.net/javascript/convert-size-in-bytes-to-human-readable-format-(javascript)#comment-1
      */
      self.bytesToSize = function (bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return 'n/a';
                      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      };

      /*Format a Date*/
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
  return new appUtils;
  }
)