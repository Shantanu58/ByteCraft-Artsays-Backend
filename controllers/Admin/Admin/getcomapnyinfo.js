const Business = require('../../../Models/companyinfo');

const getAllCompanyInfo = async (req, res) => {
    try {
        const businesses = await Business.find(); // Fetch all company records

        if (!businesses || businesses.length === 0) {
            return res.status(404).json({ message: "No company info found." });
        }

        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = getAllCompanyInfo;
