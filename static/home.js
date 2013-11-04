function fakeData(time, type) {
	this.time = time;
	this.type = type;
}


function makeFakeData() {
	var data = [];
	var times = [0, 1, 2, 3];
	var types = ['img', 'doc', 'log'];
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
	refreshDOM(files);
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

function refreshDOM(files) {
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
			
			switch (file.type) {
				case ('img'):
					break;
				case ('doc'):
					break;
				case('log'):
					break;					
			}
			myList.append(elem);
			console.log(elem);
		});

		i++;
	}
}


$(document).ready(function() {
	processFile("Asdf");
});
