function displayHighlighted() {
  var table = $('#results');
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

function unselect_all_files(){
  plot.unhighlight();
  highlighted = [];
  displayHighlighted();
}