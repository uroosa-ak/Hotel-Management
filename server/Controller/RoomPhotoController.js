const RoomPhoto = require("../models/RoomPhoto");

exports.addPhoto = async (req, res) => {
    try {
        const photo = await RoomPhoto.create(req.body);
        res.status(201).json(photo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPhotos = async (req, res) => {
    try {
        const photos = await RoomPhoto.find().populate("room");
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        await RoomPhoto.findByIdAndDelete(req.params.id);
        res.json({ message: "Room photo deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};