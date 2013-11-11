var spawn   = require('child_process').spawn;
var exec    = require('child_process').exec;
var express = require('express');
var fs      = require('fs');
var sqlite3 = require('sqlite3').verbose();
var app     = express();

var TSKTools = [["fsstat", "fstools/"], ["blkstat", "fstools/"]];

app.use(express.static(__dirname));

var IMAGE_REGEX = /\S*\.(dd|raw)/g;
var available_images = [];
var db_path = 'target_img_db.db';
var target_img = "";

// req type:
// - None
// res type:
// - imgs: List of available images in /images directory
// - output: Raw string of output. May or may not be useful
app.get('/get_images', function(req, res) {
  cmd = 'ls ' + __dirname+'/../images/*';
  console.log('Running cmd: '+cmd);
  output = [];
  var command = exec(cmd,
    function(error,stdout,stderr) {
      console.log('ERROR: '+error);
      available_images = stdout.match(IMAGE_REGEX);
      console.log(available_images);
      //available_images = available_images.filter(isNotEmpty);
      output.push(stdout);
    });

  command.on('close', function(code) {
    if (code === 0)
      res.json({imgs : available_images,
                output : output});
    else
      res.send(500); // when the script fails, generate a Server Error HTTP response
  });
});

// req type:
// - img_name: String representing their selected image
// res type:
// - success: boolean if the file was valid or not
// - output: Raw string of output. May or may not be useful
app.get('/select_image', function(req, res) {
  console.log('images: '+available_images);
  console.log('requested: '+req.query.img_name);
  if(available_images.indexOf(req.query.img_name) === -1)
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

  cmd = 'tsk_loaddb -d '+db_path+' '+target_img;
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

app.get('/list_files', function(req,res) {
  var db = new sqlite3.Database(db_path);
  var exists = fs.existsSync(db_path);
  var files = [];
  db.serialize(function() {
    if(!exists)
    {
      console.log("Can't find db file");
    }
    else
    {
      db.each("SELECT * FROM tsk_files",
        // Callback
        function(err,row)
        {
          files.push(row);
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

// Need to be entered by user at some point
//var toolPath = '/home/eugene/Desktop/sleuthkit-4.1.2/tools/';
//var imagePath = __dirname + '/../images/';
/*
function parse_cmd (req) {
  var toolPath = req.query.toolPath;
  // Add trailing '/' if necessarry
  if (toolPath.slice (-1) !== "/") toolPath = toolPath + "/";

  // TODO - validate image path and tool path

  // Ignore mount for now - not yet implemented
  if (req.query.cmd === "mount") return;
  
  var cmdParts = req.query.cmd.split (' ');
  var cmd = cmdParts[0];        // the command
  var cmdOptions = cmdParts.slice (1);  // any trailing options

  // TODO - check if command is TSK tool, so that we can 
  // inject the image path into the command
  var isTSKTool = false;
  for (var i = 0; i < TSKTools.length; i++) {
    if (cmd === TSKTools[i][0]) {
      cmd = toolPath + TSKTools[i][1] + cmd;
      isTSKTool = true;
    }
  }
 
  // inject image path into command
  if (isTSKTool === true)
    return cmd + " " + req.query.imagePath + " " + cmdOptions.join(" ");
  else
    return null;
}

app.get('/exec_cmd', function(req, res) {
  console.log("Running command: "+req.query.cmd);
  //console.log("On target: "+req.query.target);
  console.log("Image path: " + req.query.imagePath);
  console.log("TSK Tool path: " + req.query.toolPath);

  console.log("Executing parsed command: "+cmd);

  cmd = parse_cmd(req);
  output = [];

  var command = exec(cmd,
    function(error,stdout,stderr) {
      console.log('ERROR: '+error);
      output.push(stdout);
    });

  command.on('close', function(code) {
    if (code === 0)
    {
      res.send(Buffer.concat(output));
    }
    else
    {
      res.send(500); // when the script fails, generate a Server Error HTTP response
    }
  });
});
*/

app.listen(3000);
