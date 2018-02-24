// import { userInfo } from 'os';

const port = process.env.PORT || 5000;
const express = require('express');
const app = express();
const parseurl = require('parseurl');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/hundop';
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

var fs = require('fs');
var Gridfs = require('gridfs-stream');
var multiparty = require('connect-multiparty')();

const User = require('./models/user.js');
const Test = require('./models/test.js');
const ImageModel = require('./models/imagemodel.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
// store: new MongoStore({   mongooseConnection: db })
}));
app.post('/api/signin', function(req, res) {
  console.log(req.body);
  if (req.body.email && req.body.username && req.body.password && req.body.type === 'signup') {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
    User.create(userData, function(error, user) {
      if (error) {
        console.log(error);
        if (error.code === 11000) {
          console.log('duplicate');
          return res.send('duplicate');

        } else {
          return res.send(error);
        }
      } else {
        req.session.userId = user._id;
        let message = {
          'url': '/home',
          'user': String(user.username)
        };
        return res.send(JSON.stringify(message));
      }
    });

  } else if (req.body.email && req.body.password && req.body.type === 'login') {
    User
      .authenticate(req.body.email, req.body.password, function(error, user) {
        if (error || !user) {
          console.log('error: ' + user);
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return res.send(err);
        } else {
          req.session.userId = user._id;
          let message = {
            'url': '/home',
            'user': String(user.username)
          };
          return res.send(JSON.stringify(message));
        }
      });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    err.message = 'All fields required.';
    return res.send(err);
  }
});

app.post('/api/logout', function(req, res) {
  if (req.session) {
    req
      .session
      .destroy(function(err) {
        if (err) {
          return res.send(err);
        } else {
          let message = {
            "url": "/"
          };
          return res.send(JSON.stringify(message));
        }
      });
  }
});

app.post('/api/testsave', function(req, res) {
  if (req.body.testId && req.body.testName && req.body.testState) {
    User
      .findById(req.session.userId, function(err, user) {
        let flag = true;
        for (i = 0; i < user.tests.length; i++) {
          console.log(user.tests[i].testId, req.body.testId);
          if (user.tests[i].testId === req.body.testId) {
            console.log('test found');
            user.tests[i].testState = req.body.testState;
            flag = false;
          }
        }
        if (flag) {
          console.log('test not found');
          user
            .tests
            .push({
              testId: req.body.testId,
              testName: req.body.testName,
              testState: req.body.testState
            });
        }

        user
          .save(function(err) {
            if (err)
              return res.send(err);
            console.log('test saved');
          });

      });
  }
});

app.get('/api/authenticate', function(req, res) {
  User
    .findById(req.session.userId, function(err, user) {
      console.log('check user authentication');
      if (err || !user) {

        let message = {
          'isAuthenticated': false
        };
        console.log(message);
        res.send(message);
      } else {
        let message = {
          'isAuthenticated': true
        };
        console.log(message);
        res.send(message);
      }
    });
});

app.get('/api/testids', function(req, res) {
  console.log('get testids and teststates');
  User.findById(req.session.userId, function(err, user) {
    let testIds = [];
    for (i = 0; i < user.tests.length; i++) {
      testIds.push(user.tests[i].testId);
    }
    let message = {
      'testIds': testIds
    };
    res.send(message);
  });
});
app.post('/api/teststate', function(req, res) {
  console.log('get teststate for: ' + req.body.testId);
  User.findById(req.session.userId, function(err, user) {
    let testState = '';
    for (i = 0; i < user.tests.length; i++) {
      if (req.body.testId === user.tests[i].testId) {
        testState = user.tests[i].testState;
      }
    }
    let message = {
      'testState': testState
    };
    res.send(message);
  });
});
//==========================// ====MONGOOSE CONNECT===//
mongoose.connect(url, function(err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
  }
});

// ==========================// 
// configure storage //hardcoded, should be
// automated 
// const userDir = './uploads';
// const testDir = '/test';
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     /* Files will be saved in the 'uploads' directory. Make
//           sure this directory already exists!     */
//     cb(null, './uploads');
//     // cb(null, userDir + testDir + '/ungraded_images');
//   },
//   filename: (req, file, cb) => {
//     /* uuidv4() will generate a random ID that we'll use for the new filename. We use
//     path.extname() to get the extension from the original file name and add
//     that to the new generated ID. These combined will create the file name
//     used to save the file on the server and will be available as
//     req.file.pathname in the router handler.     */
//     const newFilename = `${path.basename(file.originalname)}`;
//     // const newFilename = `${path.extname(file.originalname)}`;     
//     cb(null, newFilename);
//   },
// });
// // // create the multer instance that will be used to upload/save the file 
// const upload = multer({
//    storage
// });
// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({
// //   extended: true
// // }));
  /*     We now have a new req.file object here. At this point the file has been 
  saved and the req.file.filename value will be the name returned by the filename() function
  defined in the diskStorage configuration. Other form fields     are
  available here in req.body.   */
// app.post('/api/upload', upload.array('selectedFiles'), (req, res) => {
//   /*     We now have a new req.file object here. At this point the file has been 
//   saved and the req.file.filename value will be the name returned by the filename() function
//   defined in the diskStorage configuration. Other form fields     are
//   available here in req.body.   */

//   console.log(req.body); 
//   res.send();
// });

app.post('/api/upload', multiparty, (req, res) => {
  var db = mongoose.connection.db;
  var mongoDriver = mongoose.mongo;
  var gfs = new Gridfs(db, mongoDriver);
  console.log('req.files.selectedFiles.name: ' + req.files.selectedFiles.name);

  var writestream = gfs.createWriteStream({
    filename: req.files.selectedFiles.name,
    mode: 'w',
    content_type: req.files.selectedFiles.mimetype,
    metadata: req.body
  });

  fs.createReadStream(req.files.selectedFiles.path).pipe(writestream);
  writestream.on('close', function(file) {
    User.findById(req.session.userId, function(err, user) {
      if(err){
        let message = {
          'message': 'error writeing file to server'
        };
        return res.send(JSON.stringify(message));
      }else if(!user){
        let message = {
          'message': 'could not verify user'
        };
        return res.send(JSON.stringify(message));
      } 
       console.log('user: ' + user + ' file._id: ' + file._id);
      // gfs.exist({_id: mongoose.Types.ObjectId(file._id)}, function (err, found) {
      //   if (err){
      //     console.log('error: ', err);
      //     throw err;
      //   }
      //   if(found){
      //     console.log('File does not exist, push id to imageIds');
          user.imageIds.push({imageId: file._id});
      //   }else{
      //     console.log('File exists, rewrite imageId');
      //     for(let i = 0; i < user.imageIds.length; i++){
      //       if(user.imageIds[i].imageId === file._id){
      //         user.imageIds[i].imageId = file._id;
      //       }
      //     }
      //   }
      // });
       
       user.save(function(err, updatedUser) {
        if(err){
          let message = {
            'message': 'error saving file to server'
          };
          return res.send(JSON.stringify(message));
        }
        // return res.json(200, updatedUser)
       })
     });
     fs.unlink(req.files.selectedFiles.path, function(err) {
       // handle error
       console.log('success!')
     });
  });
});

app.get('/api/imagetest', function(req, res) {
  var db = mongoose.connection.db;
  var mongoDriver = mongoose.mongo;
  var gfs = new Gridfs(db, mongoDriver);
  
  console.log('imagetest start');
  let fileId = '';
  User.findById(req.session.userId, function(err, user) {
    console.log('found user ' + user);
    if(err){
      console.log('error');
      let message = {
        'message': 'error writeing file to server'
      };
      return res.send(JSON.stringify(message));
    }else if(!user){
      console.log('no user');
      let message = {
        'message': 'could not verify user'
      };
      return res.send(JSON.stringify(message));
    } 
    console.log('user.imageIds ' + user.imageIds);

    //for test purposes we hardcode which imageId
    var readstream = gfs.createReadStream({ 
      _id: mongoose.Types.ObjectId(user.imageIds[0].imageId) 
    });
    readstream.on('error', function(err){
      console.log('error: ', err);
      throw err;
    });
    readstream.pipe(res);
  });

});

// =============================================================================
/*
 * Grade test function
 */
function call_python(x, callback) {
  const spawn = require('child_process').spawn;
  const ls = spawn('python', ['./python/run.py']);

  ls
    .stdout
    .on('data', (data) => {
      x = `${data}`;
    });

  ls
    .stderr
    .on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

  ls.on('close', (code) => {
    callback(x);
    console.log(`stdout:  ${x}`);
    console.log(`child process exited with code ${code}`);
  });
}

app
  .get('/api/hello', function(req, res) {
    var x = 'init';
    call_python(x, function(data) {
      res.send({
        express: data
      });
    });
  });

app.listen(port, () => console.log(`Listening on port ${port}`));