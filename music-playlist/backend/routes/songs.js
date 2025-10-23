const express = require("express");
const router = express.Router();
const Song = require("../models/Song");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

// CREATE song
router.post("/", upload, async (req, res) => {
  try {
    const { title, artist, album, genre, duration, releaseYear } = req.body;
    const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : "";
    const audioUrl = req.files?.audio ? `/uploads/${req.files.audio[0].filename}` : "";

    const newSong = new Song({ title, artist, album, genre, duration, releaseYear, imageUrl, audioUrl });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all songs
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single song
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE song
router.put("/:id", upload, async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.files?.image) updatedData.imageUrl = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.audio) updatedData.audioUrl = `/uploads/${req.files.audio[0].filename}`;

    const song = await Song.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE song
router.delete("/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
