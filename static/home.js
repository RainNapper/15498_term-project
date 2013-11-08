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
	var times = [0, 1, 2, 3];
	var types = ['jpg', 'doc', 'log'];
    var i = 0;
    while (i < 5) {
        var time = Math.floor(Math.random()*times.length);
		var type = Math.floor(Math.random()*types.length);
		data[i] =  new fakeData(times[time], types[type]);
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
	var myList = $("#content");
	
	if (myList !== null) {
		myList.empty();
	}
	
	var i = 0;
	for (var time in files) {
		var date = files[time];
		date.forEach(function(file, i){
			var elem =	
			$('<li>')
				.html("<div id="+file.time+"><h3>"+file.time + file.type+"</h3>"+
				"</div>"
			);
			
			if (docs.indexOf(file.type) > -1) {
				console.log("doc", file.type);
			} else if (img.indexOf(file.type) > -1) {
				console.log("img", file.type);
			} else if (misc.indexOf(file.type) > -1) {
				console.log("misc", file.type);
			} else {
				console.log("somthing else...", file.type);
			}							
			myList.append(elem);
		});
		i++;
	}
}

var tl;
function onLoad() {
  var bandInfos = [
    Timeline.createBandInfo({
        width:          "70%", 
        intervalUnit:   Timeline.DateTime.MONTH, 
        intervalPixels: 100
    }),
    Timeline.createBandInfo({
        width:          "30%", 
        intervalUnit:   Timeline.DateTime.YEAR, 
        intervalPixels: 200
    })
  ];
  tl = Timeline.create(document.getElementById("timeline"), bandInfos);
}

var resizeTimerID = null;
function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}
$(document).ready(function() {
	// Load the Visualization API and the piechart package.
	 processFile("Asdf");
});
