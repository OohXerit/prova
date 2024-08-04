const Canvas = require('../models/canvasModel');
const { io } = require('../server');

exports.getCanvas = async (req, res) => {
  try {
    const canvas = await Canvas.findOne();
    res.json(canvas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addImage = async (req, res) => {
  try {
    const { x, y } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const canvas = await Canvas.findOne();
    canvas.elements.push({ type: 'image', url: imageUrl, x, y });
    await canvas.save();
    io.emit('canvasUpdate', canvas);
    res.json(canvas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addGif = async (req, res) => {
  try {
    const { x, y } = req.body;
    const gifUrl = `/uploads/${req.file.filename}`;
    const canvas = await Canvas.findOne();
    canvas.elements.push({ type: 'gif', url: gifUrl, x, y });
    await canvas.save();
    io.emit('canvasUpdate', canvas);
    res.json(canvas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCanvas = async (req, res) => {
  try {
    const { elements } = req.body;
    const canvas = await Canvas.findOneAndUpdate({}, { elements }, { new: true });
    io.emit('canvasUpdate', canvas);
    res.json(canvas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};