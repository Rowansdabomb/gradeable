var mongoose = require('mongoose');
var ImageModel = require('./imagemodel.js');
var TestTakerModel = require('./testtaker.js');

var TestSchema = new mongoose.Schema({
  testTitle: {
    type: String,
    required: true,
    trim: true
  },
  testId: {
    type: String,
    required: true,
    trim: true
  },
  testState: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  testTakers: [TestTakerModel.schema],
  imageIds: [ImageModel.schema],
});

TestSchema.pre('save', function (next) {
  var user = this;
  let now = new Date();
  user.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var Test = mongoose.model('Test', TestSchema);
module.exports = Test;