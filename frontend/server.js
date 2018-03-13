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
          user.tests.push({
              testId: req.body.testId,
              testName: req.body.testName,
              testState: req.body.testState
            });
        }

        user
          .save(function(err) {
            if (err)
              return res.send(err);
            res.sendStatus(200);
            console.log('test saved');
          });

      });
  }
});

app.get('/api/authenticate', function(req, res) {
  User
    .findById(req.session.userId, function(err, user) {
      if (err || !user) {
        let message = {
          'isAuthenticated': false
        };
        res.send(message);
      } else {
        let message = {
          'isAuthenticated': true
        };
        res.send(message);
      }
    });
});
app.get('/api/testids', function(req, res) {
  User.findById(req.session.userId, function(err, user) {
    let testIds = [];
    let testNames = [];
    for (i = 0; i < user.tests.length; i++) {
      testIds.push(user.tests[i].testId);
      testNames.push(user.tests[i].testName);
    }
    let message = {
      'testIds': testIds,
      'testNames': testNames
    };
    res.send(message);
  });
});
app.post('/api/teststate', function(req, res) {
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

app.post('/api/upload', multiparty, (req, res) => {
  var db = mongoose.connection.db;
  var mongoDriver = mongoose.mongo;
  var gfs = new Gridfs(db, mongoDriver);
  for(i in req.files.selectedFiles){
    console.log('req.files.selectedFiles[i].name: ' + req.files.selectedFiles[i].name);
    console.log('req.files.selectedFiles[i].path: ' + req.files.selectedFiles[i].path);
    var writestream = gfs.createWriteStream({
      filename: req.files.selectedFiles[i].name,
      mode: 'w',
      content_type: req.files.selectedFiles[i].mimetype,
      metadata: req.body
    });
    fs.createReadStream(req.files.selectedFiles[i].path).pipe(writestream);
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
        
        user.tempImages.push({imageId: file._id});
        
        user.save(function(err, updatedUser) {
          if(err){
            let message = {
              'message': 'error saving file to server'
            };
            return res.send(JSON.stringify(message));
          }
          return res.sendStatus(200);
        })
      });
      fs.unlink(req.files.selectedFiles[i].path, function(err) {
        // handle error
        console.log('success!')
      });
    });
  }
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
    console.log('user.tempImages ' + user.tempImages);

    //for test purposes we hardcode which imageId
    var readstream = gfs.createReadStream({ 
      _id: mongoose.Types.ObjectId(user.tempImages[0].imageId) 
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
function call_python(x, userId, callback) {
  const spawn = require('child_process').spawn;
  const ls = spawn('python', ['./python/run.py', userId]);
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

app.post('/api/gradetests', function(req, res) {
    var x = 'init';
    console.log(req.session.userId);
    call_python(x, req.session.userId, function(data) {
      res.send({
        message: data
      });
    });
  });

app.listen(port, () => console.log(`Listening on port ${port}`));