const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

async function updatePaymentProofLinkColumn() {
    try {
        console.log('Updating paymentProofLink column to TEXT type...');

        // Alter the column type from VARCHAR(255) to TEXT
        await sequelize.query(`
            ALTER TABLE Applications 
            MODIFY COLUMN paymentProofLink TEXT;
        `);

        console.log('✅ Successfully updated paymentProofLink column to TEXT type');
        console.log('The column can now store base64 encoded images');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating column:', error.message);
        process.exit(1);
    }
}

updatePaymentProofLinkColumn();
