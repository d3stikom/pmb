const News = require('../models/News');
const Schedule = require('../models/Schedule');

// News Controllers
exports.getNews = async (req, res) => {
    try {
        const news = await News.findAll({
            where: { isPublished: true },
            order: [['createdAt', 'DESC']]
        });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error: error.message });
    }
};

exports.getAllNewsAdmin = async (req, res) => {
    try {
        const news = await News.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all news', error: error.message });
    }
};

exports.createNews = async (req, res) => {
    try {
        console.log('Creating news with data:', req.body);
        const news = await News.create(req.body);
        res.status(201).json(news);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ message: 'Error creating news', error: error.message });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });
        await news.update(req.body);
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error updating news', error: error.message });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });
        await news.destroy();
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news', error: error.message });
    }
};

// Schedule Controllers
exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            where: { isActive: true },
            order: [['startDate', 'ASC']]
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
};

exports.getAllSchedulesAdmin = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            order: [['startDate', 'ASC']]
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all schedules', error: error.message });
    }
};

exports.createSchedule = async (req, res) => {
    try {
        console.log('Creating schedule with data:', req.body);
        const schedule = await Schedule.create(req.body);
        res.status(201).json(schedule);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ message: 'Error creating schedule', error: error.message });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        await schedule.update(req.body);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error updating schedule', error: error.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        await schedule.destroy();
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error: error.message });
    }
};
