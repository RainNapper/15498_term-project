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
  filetypes.forEach(function(extList,i)
  {
    ticks.push([i,extList[0]]);
  });
  return ticks;
}

function drawTimeline(dfiles) {
  var i = 0;
  var dpoints = [];
  var minTime, maxTime;

  if (dfiles !== null) {
    dfiles.forEach(function(file, i){
      if (!debug) {
        var jsTime = new Date(1000*file.time);
        dpoints.push([jsTime, classifyFile(file.type)]);
        if (minTime == null && maxTime == null) {
          minTime = jsTime;
          maxTime = jsTime;
        } else if ( jsTime < minTime)
          minTime = jsTime;
        else if ( jsTime > maxTime)
          maxTime = jsTime;
      }
      else {
        dpoints.push([file.time, classifyFile(file.type)]);
        console.log(file.time);
        if (minTime == null && maxTime == null) {
          minTime = file.time;
          maxTime = file.time;
        } else if ( file.time < minTime)
          minTime = file.time;
        else if ( file.time > maxTime)
          maxTime = file.time;
     }
    });
  }
  
  var options = {
    xaxis: { 
      mode: "time",
      timeformat: "%Y/%m/%d",
      zoomRange: [1000, maxTime-minTime],
      panRange: [minTime, maxTime],
    },
    yaxis: {
      min: -1,
      max: 5,
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
    }
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
    }
    else console.log("click");
  });
  
  timeline.bind("plothover", function(event, pos, item){
     event.preventDefault();
  });
  
  timeline.bind("plotzoom", function (event, pos, item) { 
    event.preventDefault();
    adjustAxes(plot);
  });
  
  timeline.bind("plotpan", function (event, plot) {
    event.preventDefault();
    adjustAxes(plot);
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
 
}

function adjustAxes(plot) {
  var axes = plot.getAxes();
  var x = plot.getOptions();
  var minDate = new Date(axes.xaxis.min);
  var maxDate = new Date(axes.xaxis.max);
  
  console.log(minDate, maxDate);
  
  //same year
  if (minDate.getFullYear() === maxDate.getFullYear()) {
    $("#tl-Year").html(minDate.getFullYear());
    
    //same month
    if (minDate.getMonth() === maxDate.getMonth()) {
      $("#tl-Month").html("/"+(minDate.getMonth()+1));
      
      //same day -> switch to HMS time
      if (maxDate.getDate() - minDate.getDate() <= 1) {
        $("#tl-Date").html("/"+minDate.getDate());
        plot.getOptions().xaxes[0].timeformat = '%H:%M:%S';
      } 
      
      //different days
      else {
         $("#tl-Date").html('');
        if (minDate.getDate() < maxDate.getDate()) {
          plot.getOptions().xaxes[0].timeformat = '%d';
        }
      }
    }

    //different months
    else {
      $("#tl-Month").html('');
      $("#tl-Date").html('');
      //different days
      if (minDate.getMonth() < maxDate.getMonth()) {
        plot.getOptions().xaxes[0].timeformat = '%m/%d';
      }
    }
  } 
  //different years
  else {
    $("#tl-Year").html('');
    $("#tl-Month").html('');
    $("#tl-Date").html('');
    plot.getOptions().xaxes[0].timeformat = '%Y/%m/%d';
  }
  plot.setupGrid();
  plot.draw();
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
       var d = (series.data[j]);
      var x = offset.left + axes.xaxis.p2c(d[0]);
      var y = offset.top + axes.yaxis.p2c(d[1]);
      var r = 20; 
      ctx.fillStyle = color;
      ctx.fillRect(x-r,y-r,2*r,2*r);
    }    
  }
}
