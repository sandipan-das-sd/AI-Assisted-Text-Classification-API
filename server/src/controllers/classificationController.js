const mongoose = require("mongoose");
const Classification = require("../models/Classification");
const defaultService = require("../services/classificationService");

async function classify(req, res, next) {
  try {
    const text = req.body?.text;
    if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "A non-empty 'text' string is required" });
    if (text.length > 5000) return res.status(400).json({ error: "Text must be 5,000 characters or fewer" });
    const service = req.app.locals.classificationService || defaultService;
    const result = await service.classifyText(text.trim());
    if (mongoose.connection.readyState === 1) await Classification.create({ text: text.trim(), ...result });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
module.exports = { classify };
