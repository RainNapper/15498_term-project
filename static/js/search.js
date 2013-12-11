var daysOfWeek = [[0, 'Sunday'], [1, 'Monday'], [2, 'Tuesday'], [3, 'Wednesday'],
              [4, 'Thursday'] , [5, 'Friday'], [6, 'Saturday']];

var extTypes = [[0, 'doc'], [1, 'img'], [2, 'misc']];

var timeTypes = [[0, 'Created'],[1, 'Last Modified'], [2, 'Last Accessed'],
                 [3,'Metadata Status Change']];

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
    $('#days_of_week').append(checkday, day[1], br);
  });
  
  extTypes.forEach(function(ext,i) {
    var checkext = $('<input>').addClass("extensions")
                             .attr({"type":"checkbox", "name":ext[0],"value":ext[1]});
    var br = $('<br>');
    $('#extensions').append(checkext, ext[1], br);
  });

  timeTypes.forEach(function(tt,i) {
    var checkOpt = new Option(tt[1],tt[0]);
    $('#time_type').append(checkOpt);
  });
  
}  
  
function filter() {
  var timeMode = $('#time_type').val();
  var days = [];
  var extensions = [];
  var start = [];
  var end = [];
  
  $('#startDate').children().each(function() {
    start.push($(this).val());
  });
  
  $('#endDate').children().each(function() {
    end.push($(this).val());
  });
  
  if (!debug && start[0].length !== 2 && start[1].length !== 2 && start[2].length!== 4 )
  {
    alert("Invalid start date");  
    return;
  }
  else if (!debug && end[0].length !== 2 && end[1].length !== 2 && end[2].length!== 4)
  {
    alert("Invalid end date");  
    return;
  }

  var startDate = new Date(start[1], start[0], start[2]);
  var endDate = new Date(end[1], end[0], end[2]);

  var startTime = Date.parse($('#startTimeInput').val());
  var endTime = Date.parse($('#endTimeInput').val());
  
  $('#days_of_week').find('input').each(function(){
    if(this.checked)
    days.push(this.name);
  });

  $('#extensions').find('input').each(function(){
    if(this.checked)
    days.push(this.name);
  });


  var filter = {"timeMode": timeMode,
    "days": days,
    "extensions": extensions,
    "startTime": startTime,
    "endTime": endTime};

  if(debug || true)
    console.log('Filter Request:',filter);

  $.get('/get_files',filter)
    .done(list_files);

}


function list_files(res)
{
  if(res.success)
  {
    $('#output').val(JSON.stringify(res));
    files = res.file_list;
  }
  else
    alert("Something failed!");

  if (debug) {
    drawTimeline(makeFakeData());
  } else {
    drawTimeline(files);
  }
}


function next(thisbox, nextbox) {

  if ( thisbox.value.length == thisbox.maxLength) {
    if (nextbox !== '')
      thisbox.form.elements[nextbox].focus();
  }
}
