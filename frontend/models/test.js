var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
    trim: true
  },
  testId: {
    type: String,
    // unique: true,
    required: true,
    trim: true
  },
  // cyclic dependency error due to this block of code
  testState: {
    type: String,
    required: true,
    trim: true
  },
  modified: {
    type: Date,
    default: Date.now
  },
});

// TestSchema.pre('save', function (next) {
//   var test = this;
//   test.modified = Date.now;
// });
var Test = mongoose.model('Test', TestSchema);
module.exports = Test;