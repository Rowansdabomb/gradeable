var mongoose = require('mongoose');
var ImageModel = require('./imagemodel.js');

var TestTakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  testId: {
    type: String,
  },
  testNumber: {
    type: Number,
  },
  grade: {
    type: Number,
  },
  imageIds: [ImageModel.schema],
});

var TestTaker = mongoose.model('TestTaker', TestTakerSchema);
module.exports = TestTaker;