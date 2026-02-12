const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const RegistrationPath = require('./RegistrationPath');
const StudyProgram = require('./StudyProgram');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    // Registration & Choice
    registrationPathId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: RegistrationPath,
            key: 'id'
        }
    },
    studyProgramId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: StudyProgram,
            key: 'id'
        }
    },
    studyProgramId2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: StudyProgram,
            key: 'id'
        }
    },

    // Personal Data
    nik: DataTypes.STRING(16),
    gender: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    address: DataTypes.TEXT,
    mapLink: DataTypes.STRING,
    birthPlace: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    religion: DataTypes.STRING,
    phone: DataTypes.STRING,

    // Education Data
    schoolName: DataTypes.STRING,
    schoolType: DataTypes.STRING, // SMA, SMK, MA, etc.
    schoolProvince: DataTypes.STRING,
    schoolCity: DataTypes.STRING,
    graduationYear: DataTypes.INTEGER,

    // Parent Data
    fatherName: DataTypes.STRING,
    motherName: DataTypes.STRING,
    parentPhone: DataTypes.STRING,
    parentOccupation: DataTypes.STRING,
    parentSalary: DataTypes.STRING,

    // Marketing Data
    sponsorName: DataTypes.STRING,
    informationSource: DataTypes.STRING,
    fileLink: DataTypes.STRING,
    paymentProofLink: DataTypes.STRING,

    status: {
        type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'VERIFIED', 'REJECTED'),
        defaultValue: 'DRAFT',
    },
});

// Associations
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

RegistrationPath.hasMany(Application, { foreignKey: 'registrationPathId' });
Application.belongsTo(RegistrationPath, { foreignKey: 'registrationPathId' });

StudyProgram.hasMany(Application, { foreignKey: 'studyProgramId', as: 'Program1' });
Application.belongsTo(StudyProgram, { foreignKey: 'studyProgramId', as: 'Program1' });

StudyProgram.hasMany(Application, { foreignKey: 'studyProgramId2', as: 'Program2' });
Application.belongsTo(StudyProgram, { foreignKey: 'studyProgramId2', as: 'Program2' });

module.exports = Application;
