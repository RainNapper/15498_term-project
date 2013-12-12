var spawn   = require('child_process').spawn;
var exec    = require('child_process').exec;
var express = require('express');
var fs      = require('fs');
var sqlite3 = require('sqlite3').verbose();
var sql     = require('sql');
var app     = express();

var TSKTools = [["fsstat", "fstools/"], ["blkstat", "fstools/"]];

app.use(express.static(__dirname));

var images = [];
var db_path = 'target_img_db.db';
var target_img = "";

// req type:
// - None
// res type:
// - imgs: List of available images in /images directory
// - output: Raw string of output. May or may not be useful
app.get('/get_images', function(req, res) {
  images = fs.readdirSync('images')
  console.log('Found images: '+images);
  res.json({imgs: images,
            output: "Found images: "+images});
});

// req type:
// - img_name: String representing their selected image
// res type:
// - success: boolean if the file was valid or not
// - output: Raw string of output. May or may not be useful
app.get('/select_image', function(req, res) {
  console.log('images: '+images);
  console.log('requested: '+req.query.img_name);
  if(images.indexOf(req.query.img_name) === -1)
  {
    target_img = null
    found_img = false;
  }
  else
  {
    target_img = req.query.img_name;
    found_img = true;
  }

  res.json({ success : found_img,
              output : "Successfully selected image"});
});

app.get('/load_db', function(req,res) {
  cmd = 'rm '+db_path;
  console.log('Running cmd: '+cmd);
  exec(cmd,
    function(error,stdout,stderr) {
      console.log('ERROR: '+error);
      output.push(stdout);
    });

  cmd = 'tsk_loaddb -d '+db_path+' images/'+target_img;
  console.log('Running cmd: '+cmd);
  output = [];
  var command = exec(cmd,
    function(error,stdout,stderr) {
      console.log('ERROR: '+error);
      output.push(stdout);
    });

  command.on('close', function(code) {
    if (code === 0)
      res.json({ success : found_img,
                  output : "Successfully loaded database"});
    else
      res.send(500); // when the script fails, generate a Server Error HTTP response
  });
});

function format_date(d)
{
  var hours = d.getHours();
  var mins = d.getMinutes();
  var secs = d.getSeconds();

  if(hours < 10)
    hours = "0"+hours;
  if(mins < 10)
    mins = "0"+mins;
  if(secs < 10)
    secs = "0"+secs;

  return hours+':'+mins+':'+secs;
}

function build_query(req)
{
  var file_db = sql.define({
    name: 'tsk_files',
    columns: ['ctime','atime','mtime','crtime','name']
  });

  var query = file_db.select(file_db.star()).from(file_db);

  // Type of time (created, modified, accessed)
  var time = null;
  if(req.timeMode === '0')
    time = file_db.crtime; // Default to creation time for now
  if(req.timeMode === '1')
    time = file_db.mtime;
  else if(req.timeMode === '2')
    time = file_db.atime;
  else if(req.timeMode === '3')
    time = file_db.ctime;

  var strftime = sql.functionCallCreator('STRFTIME');
  var datetime = sql.functionCallCreator('DATETIME');

  if(typeof req.nameFilter === 'undefined')
    console.log("no name filter");
  else
  {
    var nameFilter = file_db.name.like('%'+req.nameFilter+'%');
    query = query.where(nameFilter);
  }

  // Start and End time range
  console.log('startTime: '+(typeof req.startTime));
  if(typeof req.startTime === 'undefined' || typeof req.endTime === 'undefined')
    console.log("no time range");
  else
  {
    var sTimeJs = new Date(req.startTime);
    var eTimeJs = new Date(req.endTime);

    startTimeString = format_date(sTimeJs);
    endTimeString = format_date(eTimeJs);

    var timeOfDay = strftime('%H:%M:%S',datetime(time,'unixepoch'));
    var timeFilter =
      timeOfDay.gte(startTimeString).and(
          timeOfDay.lte(endTimeString));
    query = query.where(timeFilter);
  }

  if(typeof req.days === 'undefined')
    console.log("no days");
  else
  {
    // Days of the week
    var dayOfWeek = strftime('%w',datetime(time,'unixepoch'));
    var daysFilter = null;
    console.log(typeof req.days);
    (req.days).forEach(function(day,i){
      var nextPart = dayOfWeek.equals(day);

      if(daysFilter === null)
      daysFilter = nextPart;
      else
      daysFilter = daysFilter.or(nextPart);
    });
    query = query.where(daysFilter);
  }

  console.log(query.toString());

  return query.toString();
}


app.get('/get_files', function(req,res) {
  var db = new sqlite3.Database(db_path);
  var exists = fs.existsSync(db_path);
  var files = [];
  var query = build_query(req.query);
  db.serialize(function() {
    if(!exists)
    {
      console.log("Can't find db file");
    }
    else
  {
    db.each(query,
      // Callback
      function(err,row)
      {
        console.log(row.name);
        if(row.crtime === 0 || row.crtime === null)
          return;
        var matches = row.name.match(/.*(\.[^\.]+)/);
        if(matches === null)
          var ext = null;
        else
          var ext = matches[1];
        var converted = {
          'time' : row.crtime,
          'aTime' : row.atime,
          'cTime' : row.ctime,
          'mTime' : row.mTime,
          'type' : ext,
          'name' : row.name,
          'size' : row.size,
        };
        files.push(converted);
      },
      // Completion callback
      function()
      {
        console.log("Finished");
        res.json( { success   : true,
          file_list : files } );
      });
  }
  });
  db.close();
});

app.post("/createGame", function(req, res){

  var timeMode = req.body.timeMode;
  var days = req.body.days;
  var extensions = req.body.extensions;
  var startDate =  req.body.start;
  var endDate =  req.body.end;

  // send array of files
  res.send( {success : true, dfiles: []});
});

app.listen(3000);

