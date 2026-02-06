const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/User');
const Application = require('./models/Application');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const pmbRoutes = require('./routes/pmb');
const masterRoutes = require('./routes/masterRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pmb', pmbRoutes);
app.use('/api/master', masterRoutes);

// basic route
app.get('/', (req, res) => {
    res.send('SPMB Backend API is running');
});

// Import Helper for DB Sync
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync({ alter: true }); // Use alter to update tables without dropping
        console.log('Database synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await syncDatabase();
});
