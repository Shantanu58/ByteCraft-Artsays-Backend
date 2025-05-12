const Business = require('../../../Models/companyinfo');

const updateCompanyInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        let business = await Business.findOne({ userId });

        if (!business) {
            business = new Business({ userId, ...req.body });
            await business.save();
            return res.status(201).json({ message: "Company info created successfully", business });
        }

        const updatedBusiness = await Business.findOneAndUpdate(
            { userId },
            req.body,
            { new: true, runValidators: true } 
        );

        res.json({ message: "Company info updated successfully", updatedBusiness });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = updateCompanyInfo;
