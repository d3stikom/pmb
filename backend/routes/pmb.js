const express = require('express');
const Application = require('../models/Application');
const RegistrationPath = require('../models/RegistrationPath');
const StudyProgram = require('../models/StudyProgram');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get Applicant Data (for Dashboard)
router.get('/my-application', verifyToken, async (req, res) => {
    try {
        const application = await Application.findOne({
            where: { userId: req.userId },
            include: [
                { model: RegistrationPath },
                { model: StudyProgram }
            ]
        });
        if (!application) {
            return res.json({ message: 'No application found', application: null });
        }
        res.json({ application });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching application', error: error.message });
    }
});

// Submit/Update Application
router.post('/apply', verifyToken, async (req, res) => {
    try {
        const {
            registrationPathId, studyProgramId, studyProgramId2,
            nik, gender, birthPlace, birthDate, religion, phone,
            schoolName, schoolType, schoolProvince, schoolCity, graduationYear,
            fatherName, motherName, parentPhone, parentOccupation, parentSalary,
            status // Optional: can be DRAFT or SUBMITTED
        } = req.body;

        const applicationData = {
            userId: req.userId,
            registrationPathId,
            studyProgramId,
            studyProgramId2,
            nik,
            gender,
            birthPlace,
            birthDate,
            religion,
            phone,
            schoolName,
            schoolType,
            schoolProvince,
            schoolCity,
            graduationYear,
            fatherName,
            motherName,
            parentPhone,
            parentOccupation,
            parentSalary,
            status: status || 'SUBMITTED'
        };

        let application = await Application.findOne({ where: { userId: req.userId } });

        if (application) {
            await application.update(applicationData);
        } else {
            application = await Application.create(applicationData);
        }

        res.json({ message: 'Application saved successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Error saving application', error: error.message });
    }
});

module.exports = router;
