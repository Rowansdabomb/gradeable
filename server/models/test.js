var mongoose = require('mongoose');

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
  thumbImage: {
    type: String
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  }
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