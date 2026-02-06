const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudyProgram = sequelize.define('StudyProgram', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, // e.g. "S1 Teknik Informatika"
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // e.g. "TI-S1"
    },
    degree: {
        type: DataTypes.STRING,
        allowNull: false, // e.g. "S1", "D3"
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

module.exports = StudyProgram;
