const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inputSchema = new Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  detections : {type: Array, required:true },
  image : {type: String, required:true}
}, {
  timestamps: true,
});

const Input = mongoose.model('Exercise', inputSchema);

module.exports = Input;