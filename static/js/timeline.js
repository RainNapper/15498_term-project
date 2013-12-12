//file extensions
var filetypes = 
  [
    ['misc', ['.log'],'purple'],
    ['docs', ['.doc', '.pdf', '.txt', '.ppt', '.tex'],'red'],
    ['imgs', ['.jpg', '.gif', '.png', '.bmp'],'green'],
    ['vids', ['.mp4', '.mov', '.m4v'],'yellow'],
    ['audio',['.mp3', '.wav', '.flac'],'blue']
  ]

var highlighted = [];
var plot;

var allFileInfo = [];

function classifyFile(type) {
  var match = 0;
  filetypes.forEach(function(extList,i)
  {
    if($.inArray(type,extList[1]) !== -1)
      match = i;
  });
  return match;
}

function xAxisLabelGenerator(x)
{
  return xAxisLabels[x];
}

function buildTicks()
{
  var ticks = []
  ticks[0] = [-1, ''];
  filetypes.forEach(function(extList,i)
  {
    ticks.push([i,extList[0]]);
  });
  ticks.push([filetypes.length, '']);
  return ticks;
}

function displayHighlighted() {
  var table = $('#file_info');
  table.html('');
  var titleRow = $('<tr></tr>');
  titleRow.append($('<td></td>').html('File Name'));
  titleRow.append($('<td></td>').html('Extension'));
  titleRow.append($('<td></td>').html('Date'));
  table.append(titleRow);
  
  highlighted.forEach(function(fileIdx,i)
  {
    var fileObj = allFileInfo[fileIdx];
    console.log(fileObj);
    var row = $('<tr></tr>');
    row.append($('<td></td>').html(fileObj.name));
    row.append($('<td></td>').html(fileObj.type));
    row.append($('<td></td>').html(new Date(fileObj.time * 1000).toString('yyyy-MM-dd')));
    table.append(row);
  });
}

function drawTimeline(dfiles) {
  var i = 0;
  var dpoints = [];
  allFileInfo = [];

  if (dfiles !== null) {
    dfiles.forEach(function(file, i){
      allFileInfo.push(file);
      if (!debug) {
        var jsTime = new Date(file.time*1000);
        dpoints.push([jsTime, classifyFile(file.type)]);
      }
      else 
      {
        dpoints.push([file.time, classifyFile(file.type)]);
      }
    });
  }

  var options = {
    xaxis: { 
      mode: "time",
      timeformat: "%y/%m/%d",
      //ticks: daysOfWeek
    },
    yaxis: {
      ticks: buildTicks(),
      zoomRange: false,
      panRange: false,
    },
    lines: { 
      show: false
    },
    points: {
      show: true,
      radius: 20,
      symbol: "square"
    },
    grid: {
      hoverable: true,
      clickable: true
    },
    zoom: {
      interactive: true,
      amount: 1.5,
    },
    pan: {
      interactive: true
    },
    hooks: { 
      draw: [raw] 
    },
    labels: 'testing'
  };

  var timeline = $("#timeline");
   
  // without unbinding, will fire plotclick events multiple times
  timeline.unbind("plotclick");
  

  plot = $.plot(timeline, [dpoints], options);

  timeline.bind("plotclick", function (event, pos, item) {  
    if (item) {
      if (highlighted.indexOf(item.dataIndex) > -1) {
        console.log("highlited");
        plot.unhighlight(item.series, item.datapoint);
        highlighted.splice(highlighted.indexOf(item.datapoint), 1);
      } else if (highlighted.indexOf(item.dataIndex) < 0){
        console.log("lalal");
        plot.highlight(item.series, item.datapoint);
        highlighted.push(item.dataIndex);
      }
      displayHighlighted();
    }
    else console.log("click");
  });
  
  timeline.bind("plothover", function(event, pos, item){
     event.preventDefault();
  });
  
  timeline.bind("plotzoom", function (event, pos, item) { 
    event.preventDefault();
    var axes = plot.getAxes();
    var x = plot.getOptions();
    var minDate = new Date(axes.xaxis.min);
    var maxDate = new Date(axes.xaxis.max);
    console.log(axes, minDate, maxDate);
     
  });
  
  timeline.bind("plotpan", function (event, plot) {
    var axes = plot.getAxes();
    var x = plot.getOptions();
    var minDate = new Date(axes.xaxis.min);
    var maxDate = new Date(axes.xaxis.max);
    console.log(axes, minDate, maxDate);
  });

  // add zoom buttons
  $("#zoom-in")
  .click(function (event) {
    event.preventDefault();
    plot.zoom();
  });

  $("#zoom-out")
  .click(function (event) {
    event.preventDefault();
    plot.zoomOut();
  });
  
  var date = $("<p>").attr('id', 'datelabel').html("Date");
  timeline.append(date);
 

  
}

// customize the way data points are drawn, by color
function raw(plot, ctx) {
  var data = plot.getData();
  var axes = plot.getAxes();
  var offset = plot.getPlotOffset();
  for (var i = 0; i < data.length; i++) {
    var series = data[i];
    for (var j = 0; j < series.data.length; j++) {
      var color = filetypes[series.data[j][1]][2]
      var d = (series.data[j]);
      var x = offset.left + axes.xaxis.p2c(d[0]);
      var y = offset.top + axes.yaxis.p2c(d[1]);
      var r = 20;
      ctx.fillStyle = color;
      ctx.fillRect(x-r,y-r,2*r,2*r);
    }    
  }
}
