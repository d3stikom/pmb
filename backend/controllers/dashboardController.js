const Application = require('../models/Application');
const StudyProgram = require('../models/StudyProgram');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
    try {
        // Get counts
        const applicantCount = await Application.count();
        const prodiCount = await StudyProgram.count();
        const userCount = await User.count();

        // Get status distribution for chart
        const statusDistribution = await Application.findAll({
            attributes: [
                'status',
                [Application.sequelize.fn('COUNT', Application.sequelize.col('status')), 'count']
            ],
            group: ['status']
        });

        res.json({
            stats: {
                applicants: applicantCount,
                studyPrograms: prodiCount,
                users: userCount
            },
            statusDistribution
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
};
