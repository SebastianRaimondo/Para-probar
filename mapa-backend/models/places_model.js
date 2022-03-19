const mongoose = require("mongoose");
const { appConfig } = require("../config");
const Schema = mongoose.Schema;

const PlaceSchema = Schema(
  {
    name: String,
    address: { type: String, unique: true },
    lactitude: Number,
    longitude: Number,
    image: [],
    category: String,
    description: String,
    votes_count: { type: Array, default: [] },
    rating: { type: Number, default: 0 },
    comments: [],
    features: [],
    description: String,
  },
  {
    timestamps: true,
  }
);

// PlaceSchema.method.setImgUrl = function setImgUrl(filename) {
//   const { host, port } = appConfig;
//   this.imgurl = `${host}:${port}/public/${filename}`;
// };

module.exports = mongoose.model("Places", PlaceSchema);
