var spawn   = require('child_process').spawn;
var exec    = require('child_process').exec;
var express = require('express');
var fs      = require('fs');
var sqlite3 = require('sqlite3').verbose();
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



app.get('/list_files', function(req,res) {
  var db = new sqlite3.Database(db_path);
  console.log("test");
  var exists = fs.existsSync(db_path);
  var files = [];
  db.serialize(function() {
    if(!exists)
    {
      console.log("Can't find db file");
    }
    else
    {
      db.each("SELECT ctime, name FROM tsk_files "+
              "ORDER BY ctime",
        // Callback
        function(err,row)
        {
          console.log(row.ctime);
          if(row.ctime === null || row.ctime === 0)
            return;
          console.log("adding");
          var converted = {
            'time' : new Date(row.ctime * 1000),
            'type' : '.jpg',
            'name' : row.name
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
