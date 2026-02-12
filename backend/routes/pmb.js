const express = require('express');
const Application = require('../models/Application');
const RegistrationPath = require('../models/RegistrationPath');
const StudyProgram = require('../models/StudyProgram');
const User = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Get Applicant Data (for Dashboard)
router.get('/my-application', verifyToken, async (req, res) => {
    try {
        const application = await Application.findOne({
            where: { userId: req.userId },
            include: [
                { model: RegistrationPath },
                { model: StudyProgram, as: 'Program1' },
                { model: StudyProgram, as: 'Program2' }
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

// Get All Applications (for Admin and Prodi)
router.get('/all', verifyToken, authorizeRoles('ADMIN', 'PRODI'), async (req, res) => {
    try {
        const whereClause = {};

        // If PRODI, filter by their study program
        if (req.userRole === 'PRODI' && req.studyProgramId) {
            whereClause[Op.or] = [
                { studyProgramId: req.user.studyProgramId },
                { studyProgramId2: req.user.studyProgramId }
            ];
        }

        const applications = await Application.findAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: RegistrationPath },
                { model: StudyProgram, as: 'Program1' },
                { model: StudyProgram, as: 'Program2' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ applications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
});

// Submit/Update Application
router.post('/apply', verifyToken, async (req, res) => {
    try {
        const {
            registrationPathId, studyProgramId, studyProgramId2,
            nik, gender, address, mapLink, birthPlace, birthDate, religion, phone,
            schoolName, schoolType, schoolProvince, schoolCity, graduationYear,
            fatherName, motherName, parentPhone, parentOccupation, parentSalary,
            sponsorName, informationSource, fileLink, paymentProofLink,
            status // Optional: can be DRAFT or SUBMITTED
        } = req.body;

        const applicationData = {
            userId: req.userId,
            registrationPathId,
            studyProgramId,
            studyProgramId2,
            nik,
            gender,
            address,
            mapLink,
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
            sponsorName,
            informationSource,
            fileLink,
            paymentProofLink,
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

// Get Specific Application Details (for Admin and Prodi)
router.get('/applications/:id', verifyToken, authorizeRoles('ADMIN', 'PRODI'), async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: RegistrationPath },
                { model: StudyProgram, as: 'Program1' },
                { model: StudyProgram, as: 'Program2' }
            ]
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if PRODI is authorized to view this application
        if (req.userRole === 'PRODI' && req.user.studyProgramId) {
            if (application.studyProgramId !== req.user.studyProgramId && application.studyProgramId2 !== req.user.studyProgramId) {
                return res.status(403).json({ message: 'Unauthorized to access this application' });
            }
        }

        res.json({ application });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching application details', error: error.message });
    }
});

// Update Application Status (for Admin and Prodi)
router.put('/applications/:id/status', verifyToken, authorizeRoles('ADMIN', 'PRODI'), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['DRAFT', 'SUBMITTED', 'VERIFIED', 'REJECTED'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if PRODI is authorized to update this application
        if (req.userRole === 'PRODI' && req.user.studyProgramId) {
            if (application.studyProgramId !== req.user.studyProgramId && application.studyProgramId2 !== req.user.studyProgramId) {
                return res.status(403).json({ message: 'Unauthorized to update this application' });
            }
        }

        await application.update({ status });

        res.json({ message: `Application status updated to ${status}`, application });
    } catch (error) {
        res.status(500).json({ message: 'Error updating application status', error: error.message });
    }
});

// Public Verification Route (For QR/ID Check)
router.get('/verify/:id', async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: RegistrationPath, attributes: ['name'] },
                { model: StudyProgram, as: 'Program1', attributes: ['name'] }
            ]
        });

        if (!application) {
            return res.status(404).json({ message: 'Data pendaftaran tidak ditemukan.' });
        }

        // Return only safe/public verification data
        const verificationData = {
            id: application.id,
            name: application.User?.name,
            registrationPath: application.RegistrationPath?.name,
            program: application.Program1?.name,
            status: application.status,
            verifiedAt: application.updatedAt
        };

        res.json({ valid: true, data: verificationData });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying application', error: error.message });
    }
});

module.exports = router;
