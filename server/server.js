var spawn   = require('child_process').spawn;
var exec    = require('child_process').exec;
var express = require('express');
var app     = express();

var TSKTools = [["fsstat", "fstools/"], ["blkstat", "fstools/"]];

app.use(express.static(__dirname));

// Need to be entered by user at some point
//var toolPath = '/home/eugene/Desktop/sleuthkit-4.1.2/tools/';
//var imagePath = __dirname + '/../images/';

app.get('/exec_cmd', function(req, res) {
  console.log("Running command: "+req.query.cmd);
  //console.log("On target: "+req.query.target);
  console.log("Image path: " + req.query.imagePath);
  console.log("TSK Tool path: " + req.query.toolPath);

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
  if (isTSKTool === true) cmd = cmd + " " + req.query.imagePath + " " + cmdOptions.join(" ");

  //target = imagePath+req.query.target;
  //cmd = toolPath + req.query.cmd+' '+target;
  console.log("Executing: "+cmd);
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

app.get('/colorsRequest', function(req, res) {
//  var command = spawn(__dirname + '/run.sh', [ req.query.color || '' ]);
//  var command = spawn('echo', [req.query.color || '']);
//  var command = spawn('ls',['-l']);
  //var command = spawn(__dirname + '/' + req.query.cmd,[]);

  console.log("Running command: "+req.query.cmd);
  console.log("With options: "+req.query.opts);
  var command = spawn(req.query.cmd,req.query.opts);
  var output  = [];

  command.stdout.on('data', function(chunk) {
    output.push(chunk);
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

app.listen(3000);
