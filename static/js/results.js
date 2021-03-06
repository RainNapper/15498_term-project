function displayHighlighted() {
  var table = $('#results');
  table.html('');
  var titleRow = $('<tr></tr>');
  titleRow.append($('<th>').html('Date'));
  titleRow.append($('<th>').html('Time'));
  titleRow.append($('<th>').html('File Name'));
  titleRow.append($('<th>').html('Extension'));
  table.append(titleRow);
  
  highlighted.forEach(function(fileIdx,i)
  {
    var fileObj = allFileInfo[fileIdx];
    //console.log(fileObj);
    var row = $('<tr></tr>');
    row.append($('<td></td>').html(getUTCDate(fileObj.time).toString('ddd yyyy-MM-dd')));
    row.append($('<td></td>').html(getUTCDate(fileObj.time).toString('hh:mm:ss')));
    row.append($('<td></td>').html(fileObj.name));
    row.append($('<td></td>').html(fileObj.type));

    table.append(row);
  });
}

function unselect_all_files(){
  plot.unhighlight();
  highlighted = [];
  displayHighlighted();
}
