//file extensions
var docs = ['doc', 'pdf', 'txt', 'ppt'];
var img = ['jpg', 'png'];
var misc = ['log'];


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


function processFile(s) {
	alert(s);
	//do something with the file name
	var fakeData = makeFakeData();
	var files = sortByTime(fakeData);
	drawTimeline(files);
} 

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

function drawTimeline(files) {
	
	var i = 0;
	var d1 = [];
	for (var t in files) {
		var d = files[t];
		d.forEach(function(file, i){
			if (docs.indexOf(file.type) > -1) {
				console.log("doc", file.time, file.type);
				d1.push([file.time, 0]);
			} else if (img.indexOf(file.type) > -1) {
				console.log("img", file.time,file.type);
				d1.push([file.time, 1]);
			} else if (misc.indexOf(file.type) > -1) {
				console.log("misc", file.time, file.type);
				d1.push([file.time, 2]);
			} else {
				console.log("somthing else...", file.time,file.type);
				d1.push([file.time, 3]);
			}										
		});
		i++;
	}
	
	$.plot("#timeline", [d1], {
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
			hooks: { 
				draw: [raw] 
			}
	});
}

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
	// Load the Visualization API and the piechart package.
	 processFile("Asdf");
});
 