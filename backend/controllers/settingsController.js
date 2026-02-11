const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });
        res.json(settingsMap);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ message: 'Key is required' });

        let setting = await Setting.findOne({ where: { key } });
        if (setting) {
            setting.value = value;
            await setting.save();
        } else {
            setting = await Setting.create({ key, value });
        }

        res.json({ message: 'Setting updated', key, value });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating setting', error: err.message });
    }
};
