var debug = 0;

// time must be in Javascript Date format
function fakeData(time, type) {
  this.time = time;
  this.type = type;
}


function makeFakeData() {
  var data = [];
  var types = ['jpg', 'doc', 'log'];
  var i = 0;
  while (i < 5) {
    var time = new Date(2013,Math.floor(Math.random()*12),Math.floor(Math.random()*30));
    var type = Math.floor(Math.random()*types.length);
    data[i] =  new fakeData(time, types[type]);
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
      if(!res.success)
      {
        alert("Something failed");
      }
    });
}

function get_files()
{
  var result = null;
  var scriptUrl = '/list_files';
  $.ajax({
    url: scriptUrl,
    type: 'get',
    dataType: 'html',
    async: false,
    success: function(res) {
      resJson = JSON.parse(res);
      if(resJson.success)
      {
        $('#output').val(res);
        result = resJson.file_list;
      }
      else
        alert("Boo failure!");
    }
  });
  return result;
}

function list_files()
{
  output = get_files();
  if (debug) {
    drawTimeline(makeFakeData());
  } else {
    drawTimeline(output);
  }
}

$(document).ready(function() {
  $('#load_db').click(load_db);
  //$('#list_files').click(list_files);
});
