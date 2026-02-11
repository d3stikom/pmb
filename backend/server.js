const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/User');
const Application = require('./models/Application');
const RegistrationPath = require('./models/RegistrationPath');
const StudyProgram = require('./models/StudyProgram');
const News = require('./models/News');
const Schedule = require('./models/Schedule');
const Setting = require('./models/Setting');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const pmbRoutes = require('./routes/pmb');
const masterRoutes = require('./routes/masterRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const infoRoutes = require('./routes/infoRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pmb', pmbRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/info', infoRoutes);

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
