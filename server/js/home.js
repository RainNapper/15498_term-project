//file extensions
var docs = ['doc', 'pdf', 'txt', 'ppt'];
var img = ['jpg', 'png'];
var misc = ['log'];


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
          if(res.success)
    {
      alert("Yay success!");
    }
          else
      alert("Boo failure!");
        });
}

function list_files()
{
  $.get('/list_files', null)
    .done(function(res)
        {
          if(res.success)
          {
            alert("Yay success!");
            $('#output').val(res.file_list);
            processFile("test");
            drawTimeline(sortByTime(res.file_list));
          }
          else
            alert("Boo failure!");
        });
}

$(document).ready(function() {
  $('#load_db').click(load_db);

  $('#list_files').click(list_files);
});
