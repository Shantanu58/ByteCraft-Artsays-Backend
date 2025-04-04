const Purchase = require('../../../Models/Packagingmaterialpurchased');
const User = require('../../../Models/usermode');

const getPurchasesByRoleAndUser = async (req, res) => {
    try {
        const { userId } = req.params; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'buyer') {
            return res.status(403).json({ message: 'Access denied. Only buyer can view this data.' });
        }

        const purchases = await Purchase.find({ user: userId })
            .populate('user', 'name lastName email phone')
            .populate({
                path: 'product',
                select: 'productName price category description mainImage otherImages',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name lastName'
                }
            });

        res.status(200).json({ purchases });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getPurchasesByRoleAndUser;
