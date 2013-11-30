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

	alert(filename);
	//do something with the file name
	
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

function drawTimeline(dfiles) {
	
	var i = 0;
	var dpoints = [];
	for (var time in dfiles) {
		var files = dfiles[time];
		files.forEach(function(file, i){
			if (docs.indexOf(file.type) > -1) {
				dpoints.push([file.time, 0]);
			} else if (img.indexOf(file.type) > -1) {
				dpoints.push([file.time, 1]);
			} else if (misc.indexOf(file.type) > -1) {
				dpoints.push([file.time, 2]);
			} else {
				dpoints.push([file.time, 3]);
			}										
		});
		i++;
	}
	
	var plot = $.plot("#timeline", [dpoints], {
		xaxis: { mode: "time" },
		yaxis: {
			ticks: [[-1,""], [0, "doc"], [1, "img"], [2, "misc"], [3,""]] 
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
		hooks: { 
			draw: [raw] 
		}
	});
	
	$("#timeline").bind("plothover", function (event, pos, item) {
		if (item) {
			var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
			$("#hoverdata").text(str);
		}
	});

	$("#timeline").bind("plotclick", function (event, pos, item) {	
		if (item) {
			$("#clickdata").text(" - click point " + item.dataIndex);
			plot.highlight(item.series, item.datapoint);
			window.open('index.html', '_blank'); //will change to something specific to the file
		}
	});
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
			if (series.data[j][1] == 0)
				color = "red";
			else if (series.data[j][1] == 1)
				color = "yellow";
			else if (series.data[j][1] == 2)
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
  };  

$(document).ready(function() {
	 processFile("Asdf");
});
 