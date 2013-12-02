var highlighted = [];
var plot;

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
	
	var options = {
		xaxis: { 
			mode: "time" 
		},
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
			clickable: true
		},
		zoom: {
			interactive: true
		},
		pan: {
			interactive: true
		},
		hooks: { 
			draw: [raw] 
		}
		
	};
	
	var timeline = $("#timeline");
	
	plot = $.plot(timeline, [dpoints], options);

	/*$(timeline).bind("plothover", function (event, pos, item) {
		if (item) {
			var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
			$("#hoverdata").text(str);
		}
	});*/

	timeline.bind("plotclick", function (event, pos, item) {	
		if (item) {
			if (highlighted.indexOf(item.dataIndex) > -1) {
				plot.unhighlight(item.series, item.datapoint);
				highlighted.splice(highlighted.indexOf(item.datapoint), 1);
			} else {
				plot.highlight(item.series, item.datapoint);
				highlighted.push(item.dataIndex);
			}
		}
		
	});
	
	timeline.bind("plotpan", function (event, plot) {
		var axes = plot.getAxes();
		$(".message").html("Panning to x: "  + axes.xaxis.min.toFixed(2)
		+ " &ndash; " + axes.xaxis.max.toFixed(2)
		+ " and y: " + axes.yaxis.min.toFixed(2)
		+ " &ndash; " + axes.yaxis.max.toFixed(2));
	});

	// timeline.bind("plotzoom", function (event, plot) {
		// var axes = plot.getAxes();
		// $(".message").html("Zooming to x: "  + axes.xaxis.min.toFixed(2)
		// + " &ndash; " + axes.xaxis.max.toFixed(2)
		// + " and y: " + axes.yaxis.min.toFixed(2)
		// + " &ndash; " + axes.yaxis.max.toFixed(2));
	// });
	
	
	$("<button type='button' class='zoom' id='zoom-in'> zoom in </button>")
	.appendTo(timeline)
	.click(function (event) {
		event.preventDefault();
		plot.zoom();
	});
	
	$("<button type='button' class='zoom' id='zoom-out'> zoom out </button>")
	.appendTo(timeline)
	.click(function (event) {
		event.preventDefault();
		plot.zoomOut();
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
