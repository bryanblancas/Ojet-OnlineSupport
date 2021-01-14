define([
  'knockout',
  'ojs/ojvalidation-datetime'
  ],
  function (ko) {
    function appUtils() {
      var self = this;


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