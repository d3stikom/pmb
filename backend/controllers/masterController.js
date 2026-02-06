const RegistrationPath = require('../models/RegistrationPath');
const StudyProgram = require('../models/StudyProgram');

exports.getPaths = async (req, res) => {
    try {
        const paths = await RegistrationPath.findAll({
            where: { isActive: true }
        });
        res.json(paths);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPathById = async (req, res) => {
    try {
        const path = await RegistrationPath.findByPk(req.params.id);
        if (!path) return res.status(404).json({ message: 'Path not found' });
        res.json(path);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPrograms = async (req, res) => {
    try {
        const programs = await StudyProgram.findAll({
            where: { isActive: true }
        });
        res.json(programs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProgramById = async (req, res) => {
    try {
        const program = await StudyProgram.findByPk(req.params.id);
        if (!program) return res.status(404).json({ message: 'Program not found' });
        res.json(program);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.seedMasterData = async (req, res) => {
    try {
        // Simple idempotency check or just force creation for dev
        const pathCount = await RegistrationPath.count();
        if (pathCount === 0) {
            await RegistrationPath.bulkCreate([
                {
                    name: 'REGULER',
                    description: 'Jalur Masuk Reguler',
                    pathDescription: 'Jalur pendaftaran standar bagi lulusan SMA/SMK/MA melalui tes tulis potensi akademik.',
                    startDate: new Date('2026-01-01'),
                    endDate: new Date('2026-08-31')
                },
                {
                    name: 'PRESTASI',
                    description: 'Jalur Prestasi Akademik/Non-Akademik',
                    pathDescription: 'Jalur khusus tanpa tes tulis bagi siswa yang memiliki prestasi akademik (nilai rapor) atau non-akademik.',
                    startDate: new Date('2026-01-01'),
                    endDate: new Date('2026-05-30')
                },
                {
                    name: 'BEASISWA',
                    description: 'Jalur Beasiswa Yayasan',
                    pathDescription: 'Jalur pendaftaran bagi calon mahasiswa yang mengajukan Beasiswa KIP-Kuliah atau Beasiswa Internal Kampus.',
                    startDate: new Date('2026-02-01'),
                    endDate: new Date('2026-04-30')
                }
            ]);
        }

        const progCount = await StudyProgram.count();
        if (progCount === 0) {
            await StudyProgram.bulkCreate([
                { name: 'S1 Teknik Informatika', code: 'TI-S1', degree: 'S1' },
                { name: 'S1 Sistem Informasi', code: 'SI-S1', degree: 'S1' },
                { name: 'D3 Manajemen Informatika', code: 'MI-D3', degree: 'D3' }
            ]);
        }

        res.json({ message: 'Master data seeded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Seeding failed', error: err.message });
    }
};
