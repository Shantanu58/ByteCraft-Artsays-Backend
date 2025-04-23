const User = require('../../../Models/usermode');

const admin = async (req, res) => {
    try {
        const admin = await User.find({ role: 'super-admin' });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching super-admin', error });
    }
};

module.exports = admin;