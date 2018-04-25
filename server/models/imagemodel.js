var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
  imageId: {
    type: String,
  },
  testId: {
    type: String,
  },
  testNumber: {
    type: Number
  },
  testTitle: {
    type: String
  },
  pageGrade: {
    type: String
  },
  pageNumber: {
    type: String
  },
  studentName: {
    type: String
  },
});

var ImageModel = mongoose.model('ImageModel', ImageSchema);
module.exports = ImageModel;