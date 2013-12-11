var daysOfWeek = [[0, 'Sunday'], [1, 'Monday'], [2, 'Tuesday'], [3, 'Wednesday'],
              [4, 'Thursday'] , [5, 'Friday'], [6, 'Saturday']];
              
var extTypes = [[0, 'doc'], [1, 'img'], [2, 'misc']];             
              

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
  daysOfWeek.forEach(function(day,i) {
    var checkday = $('<input>').addClass("daysOfWeek")
                             .attr({"type":"checkbox", "name":day[0],"value":day[1]});
    var br = $('<br>');
    console.log(checkday, day[1], br);
    $('#days_of_week').append(checkday, day[1], br);
  });
  
  extTypes.forEach(function(ext,i) {
    var checkext = $('<input>').addClass("daysOfWeek")
                             .attr({"type":"checkbox", "name":ext[0],"value":ext[1]});
    var br = $('<br>');
    console.log(checkday, ext[1], br);
    $('#extensions').append(checkext, ext[1], br);
  });
  
  
}  
  
function filter() {
  var timeMode = $('#time_type').val();
  var days = [];
  var extensions = [];
  var startDate =  $('#startDateInput').val();
  var endDate =  $('#endDateInput').val();
  $('#days_of_week').find('input').each(function(){
    days.push(this.checked);
  });
  
  $('#extensions').find('input').each(function(){
    extensions.push(this.checked);
  });
  
  if(debug)
    console.log(timeMode, startDate, endDate, days, extensions);
    
  $.ajax({
		type: "post",
		url: "/filterParameters",
		data: {"timeMode": timeMode,
           "days": days,
           "extensions": extensions,
           "start": startDate,
           "end": endDate},
		success: function() {
      console.log("hehehe");
			//drawTimeline(data.dfiles);
		}
	});

}

