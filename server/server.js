var spawn   = require('child_process').spawn;
var exec    = require('child_process').exec;
var express = require('express');
var app     = express();

app.use(express.static(__dirname));

app.get('/testSk', function(req, res) {
  console.log("Testing sk");
  //var command = spawn('../sk/sleuthkit-4.1.2/tools/fstools/fsstat', ['../images/ntfs-img-kw-1.dd'])
  console.log("dirname: "+__dirname);
  var command = exec(__dirname+'/test.sh',
    function(error,stdout,stderr) {
      console.log('error: '+error);
      console.log('stdout: '+stdout);
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
