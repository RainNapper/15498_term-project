var debug = 0;

// time must be in Javascript Date format
function fakeData(time, dayofweek, type) {
  this.time = time;
  this.dow = dayofweek;
  this.type = type;
}

function makeFakeData() {
  var data = [];
  var types = ['.jpg', '.doc', '.log'];
  var i = 0;
  while (i < 5) {
    var time = new Date(2013, Math.floor(Math.random()*12),Math.floor(Math.random()*30));
    var type = Math.floor(Math.random()*types.length);
    data[i] =  new fakeData(time, types[type], types[type]);
    i++;
  }
  return data;
}

function processFile(filename) {
  var data = makeFakeData();

  var files = sortByTime(data);
  drawTimeline(files);
} 

// maps [data0, data1, data2] -> {timestamp, [file0, file1,...]}
function sortByTime(data) {

  var dataByTime = {};
  var i = 0;
  while (i < data.length) {
    var time = data[i].time;
    if (dataByTime[time] == null) {
      var temp = [];
      dataByTime[time] = temp;
    } 
    dataByTime[time].push(data[i]);
    i++;
  }
  console.log(dataByTime);
  return dataByTime;
}

function load_db()
{
  $.get('/load_db', null)
    .done(function(res)
    {
      if(res.success)
        alert("Database created successfully!");
      else
        alert("Something failed");
    });
}

function get_all_files()
{
  $.get('/get_files',{})
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

$(document).ready(function() {
  drawTimeline([]);
  drawForm();
  $('#load_db').click(load_db);
});
