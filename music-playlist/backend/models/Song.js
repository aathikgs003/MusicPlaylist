const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
    duration: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", SongSchema);
