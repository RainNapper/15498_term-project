function toggleForm(){
   $( "#formFilter" ).toggle();
}
  
function displayDateInput(){
  if ($('#endDatePick').find($('.datepicker')).length > 0) {
    console.log("what...");
    //$('#endDatePick').DatePickerShow();
  } else {
    console.log("><");
    $('#endDatePick').DatePicker({
      format: 'Y/m/d',
      flat: true,
      date: '2008-07-31',
      current: '2008-07-31',
      calendars: 1,
      start: 1,

      onChange: function(formated, dates){
        $('#endDateInput').val(formated);
        $('#endDatePick').DatePickerHide();
      }
    });
  }
}  
  
function drawForm(){

}  
  
function filter() {
  var timeMode = $('#time_type').val();

  var days = [];
  var extensions = [];
  $('#days_of_week').find('input').each(function(){
    days.push(this.checked);
  });
  
  $('#extensions').find('input').each(function(){
    extensions.push(this.checked);
  });
  

  var startDate =  $('#startDateInput').val();
  var endDate =  $('#endDateInput').val();
  if(debug)
    console.log(timeMode, startDate, endDate, days, extensions);

}

