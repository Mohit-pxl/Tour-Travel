const Setting = require('../models/Setting');
const logger = require('../config/logger');

// ── GET /api/settings/:key ───────────────────────────────────────────────────
exports.getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ status: 'error', message: 'Setting not found' });
    }
    res.json({ status: 'success', data: { value: setting.value } });
  } catch (error) {
    logger.error('Get setting error: ' + error.message);
    res.status(500).json({ status: 'error', message: 'Could not fetch setting' });
  }
};
