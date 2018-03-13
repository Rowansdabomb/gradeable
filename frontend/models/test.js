var mongoose = require('mongoose');
var ImageModel = require('./imagemodel.js');

var TestSchema = new mongoose.Schema({
  testName: {
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
  modified: {
    type: Date,
    default: Date.now
  },
  imageIds: [ImageModel.schema],
});

// TestSchema.pre('save', function (next) {
//   var test = this;
//   test.modified = Date.now;
// });
var Test = mongoose.model('Test', TestSchema);
module.exports = Test;