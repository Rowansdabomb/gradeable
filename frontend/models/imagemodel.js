var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
  imageId: {
    type: String,
    // unique: true,
  },
});

var ImageModel = mongoose.model('ImageModel', ImageSchema);
module.exports = ImageModel;