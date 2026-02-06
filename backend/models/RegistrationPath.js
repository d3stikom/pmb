const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RegistrationPath = sequelize.define('RegistrationPath', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // e.g. "REGULER", "PRESTASI"
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pathDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

module.exports = RegistrationPath;
