const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  movieID: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Movie = mongoose.model("movie", MovieSchema);
