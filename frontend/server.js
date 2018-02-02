const express = require('express');
var wait = require('wait.for');
const app = express();
const port = process.env.PORT || 5000;

function call_python(x, callback){
  const spawn = require('child_process').spawn;
  const ls = spawn('python', ['./python/run.py']);

  ls.stdout.on('data', (data) => {
    x = `${data}`;
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    callback(x);
    console.log(`stdout:  ${x}`);
    console.log(`child process exited with code ${code}`);
  });
}

app.get('/api/hello', function(req, res) {
  var x = 'init';
  call_python(x, function(data){
    res.send({ express: data });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));