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

$(document).ready(function() {
	 processFile("file_name here");
});
 