function processFile(){
	var file = $("#file-input").val();
	if (file !== "") {
		$(".home").remove(); //remove both textfield and submit button
		var processing = $('<p>').html("id=processing");
		$("#content").append(processing);
	}
	else {
		alert("No filename specified!");
	}
} 
 
 
 function refreshDOM() {
	/*var myList = $("ul");
	
	if (myList !== null) {
		myList.empty();
	}
	*/
}	
