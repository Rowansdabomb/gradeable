const port = process.env.PORT || 5000;
const express = require('express');
const app = express();

//=============================================
/*
 * File upload
 */
const bodyParser = require('body-parser');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');

// configure storage
//hardcoded, should be automated
const userDir = './uploads';
const testDir = '/test';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /*
      Files will be saved in the 'uploads' directory. Make
      sure this directory already exists!
    */
    // cb(null, './uploads');
    cb(null, userDir + testDir + '/ungraded_images');
  },
  filename: (req, file, cb) => {
    /*
      uuidv4() will generate a random ID that we'll use for the
      new filename. We use path.extname() to get
      the extension from the original file name and add that to the new
      generated ID. These combined will create the file name used
      to save the file on the server and will be available as
      req.file.pathname in the router handler.
    */
    const newFilename = `${path.basename(file.originalname)}`;
    // const newFilename = `${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', upload.array('selectedFiles'), (req, res) => {
  /*
    We now have a new req.file object here. At this point the file has been saved
    and the req.file.filename value will be the name returned by the
    filename() function defined in the diskStorage configuration. Other form fields
    are available here in req.body.
  */
  console.log('sent');
  res.send();
});

//=================================================================================
/*
 * Grade test function  
 */
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