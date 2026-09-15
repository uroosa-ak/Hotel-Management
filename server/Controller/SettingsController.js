const SystemSettings = require("../models/SystemSettings");

// There is always exactly one settings document; create it on first access.
const getOrCreateSettings = async () => {
  let settings = await SystemSettings.findOne();
  if (!settings) settings = await SystemSettings.create({});
  return settings;
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
