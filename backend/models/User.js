const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'PRODI', 'PENDAFTAR'),
        defaultValue: 'PENDAFTAR',
    },
    studyProgramId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'StudyPrograms', // Table name
            key: 'id'
        }
    }
});

// Associations
const StudyProgram = require('./StudyProgram');
User.belongsTo(StudyProgram, { foreignKey: 'studyProgramId' });
StudyProgram.hasMany(User, { foreignKey: 'studyProgramId' });

module.exports = User;
