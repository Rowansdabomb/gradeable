var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
  imageId: {
    type: String,
  },
  tester: {
    type: String
  },
  grade: {
    type: Number
  }
});

var ImageModel = mongoose.model('ImageModel', ImageSchema);
module.exports = ImageModel;