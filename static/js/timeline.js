//file extensions
var docs = ['.doc', '.pdf', '.txt', '.ppt'];
var img = ['.jpg', '.png'];
var misc = ['.log'];

var highlighted = [];
var plot;

function classifyFile(type) {
  console.log("classifying filetype: "+type);
  if($.inArray(type,docs) !== -1)
    return 0;
  if($.inArray(type,img) !== -1)
    return 1;
  if($.inArray(type,misc) !== -1)
    return 2;
  return -1;
}

var daysOfWeek = [[0, 'Sunday'], [1, 'Monday'], [2, 'Tuesday'], [3, 'Wednesday'],
              [4, 'Thursday'] , [5, 'Friday'], [6, 'Saturday']];

function xAxisLabelGenerator(x)
{
  return xAxisLabels[x];
}

function drawTimeline(dfiles) {
  console.log("test");
  var i = 0;
  var dpoints = [];

  if (dfiles !== null) {
    dfiles.forEach(function(file, i){
      var jsTime = new Date(file.time*1000);
      console.log(classifyFile(file.type));
      dpoints.push([jsTime, classifyFile(file.type)]);
      console.log(file.time);
      console.log(file.type);
    });
  }

  var options = {
    xaxis: { 
      mode: "time",
      //ticks: daysOfWeek
    },
    yaxis: {
      ticks: [[-1,""], [0, ".doc"], [1, ".img"], [2, ".misc"], [3,""]] ,
      zoomRange: false
    },
    lines: { 
      show: false
    },
    points: {
      show: true,
      radius: 20
    },
    grid: {
      hoverable: true,
      clickable: true
    },
    zoom: {
      interactive: true,
      amount: 1.5
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

  // add zoom buttons
  $("#zoom-in")
  .click(function (event) {
  timeline.unbind("plotclick");
  event.preventDefault();
  plot.zoom();
  });

  $("#zoom-out")
  .click(function (event) {
  event.preventDefault();
  plot.zoomOut();
  });
  /*$(timeline).bind("plothover", function (event, pos, item) {
    if (item) {
      var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
      $("#hoverdata").text(str);
    }
  });
    timeline.bind("plotpan", function (event, plot) {
    var axes = plot.getAxes();
    $(".message").html("Panning to x: "  + axes.xaxis.min.toFixed(2)
    + " &ndash; " + axes.xaxis.max.toFixed(2)
    + " and y: " + axes.yaxis.min.toFixed(2)
    + " &ndash; " + axes.yaxis.max.toFixed(2));
  });


  timeline.bind("plotzoom", function (event, plot) {
    var axes = plot.getAxes();
    $(".message").html("Zooming to x: "  + axes.xaxis.min.toFixed(2)
    + " &ndash; " + axes.xaxis.max.toFixed(2)
    + " and y: " + axes.yaxis.min.toFixed(2)
    + " &ndash; " + axes.yaxis.max.toFixed(2));
  });
  */
  
}

// customize the way data points are drawn, by color
function raw(plot, ctx) {
  var data = plot.getData();
  var axes = plot.getAxes();
  var offset = plot.getPlotOffset();
  for (var i = 0; i < data.length; i++) {
    var series = data[i];
    for (var j = 0; j < series.data.length; j++) {
      var color = "";
      if (series.data[j][1] == 0) //docs
        color = "red";
      else if (series.data[j][1] == 1) //img
        color = "yellow";
      else if (series.data[j][1] == 2) //misc
        color = "green";
        var d = (series.data[j]);
        var x = offset.left + axes.xaxis.p2c(d[0]);
        var y = offset.top + axes.yaxis.p2c(d[1]);
        var r = 20;                
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2,true);
        ctx.closePath();            
        ctx.fillStyle = color;
        ctx.fill();
    }    
  }
}
