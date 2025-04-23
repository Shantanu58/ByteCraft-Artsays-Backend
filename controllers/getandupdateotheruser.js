const mongoose = require('mongoose');
const User = require('../Models/usermode');
const bcrypt = require('bcrypt');
const Artist = require('../Models/artistdetails');
const BankDetails = require('../models/bankdetails');
const Artwork = require('../models/artworklistinganddetails'); 
const UserPreferences = require("../models/buyerpreferart");
const BusinessProfile = require('../models/sellerbusinessprofile');
const SellIDetailsAndArtwork = require('../models/sellingdetailsandartwork');
const TaxLegalCompliance = require('../models/taxandlegal');
const multer = require('multer');

const getUserById = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(id)
      .populate('transactions')
      .populate('wishlist')
      .populate('cart.product')
      .populate('orders')
      .populate('bankDetails')
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};




// const changePassword = async (req, res) => {
//   const { id } = req.params;
//   const { currentPassword, newPassword, confirmPassword, email, phoneNumber, username } = req.body;

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let updatedPassword = false;
//     let updatedAccountData = false;

    
//     if (newPassword || confirmPassword || currentPassword) {
//       if (newPassword !== confirmPassword) {
//         return res.status(400).json({ message: "New password and confirm password do not match" });
//       }

//       const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
//       if (!isPasswordValid) {
//         return res.status(400).json({ message: "Current password is incorrect" });
//       }

//       const saltRounds = 10;
//       const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
//       user.password = hashedNewPassword;
//       updatedPassword = true;
//     }

 
//     if (username || phoneNumber || email) {
//       if (username) {
//         const existingUserWithUsername = await User.findOne({ username });
//         if (existingUserWithUsername && existingUserWithUsername._id.toString() !== user._id.toString()) {
//           return res.status(400).json({ message: "Username is already taken" });
//         }
//         user.username = username;
//       }

//       if (phoneNumber) {
//         const phoneRegex = /^(\+[1-9][0-9]{1,3})?[0-9]{10}$/;
//         if (!phoneRegex.test(phoneNumber)) {
//           return res.status(400).json({
//             message: "Invalid phone number format. Must be 10 digits or include a valid country code.",
//           });
//         }
//         user.phone = phoneNumber;
//       }

//       if (email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//           return res.status(400).json({ message: "Invalid email format" });
//         }
//         user.email = email;
//       }

//       updatedAccountData = true;
//     }

//     await user.save();

//     if (updatedPassword) {
//       return res.status(200).json({ message: "Password updated successfully" });
//     }

//     if (updatedAccountData) {
//       return res.status(200).json({ message: "Account data updated successfully" });
//     }

//     res.status(200).json({ message: "No changes were made" });
//   } catch (error) {
//     console.error("Error updating user information:", error.message);
//     res.status(500).json({ message: "Error updating user information", error: error.message });
//   }
// };


const updateuserprofile= async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword, email, phoneNumber, username } = req.body;
  let updateData = { ...req.body };

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedPassword = false;
    let updatedAccountData = false;

    if (newPassword || confirmPassword || currentPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      updateData.password = hashedNewPassword;
      updatedPassword = true;
    }

    if (username || phoneNumber || email) {
      if (username) {
        const existingUserWithUsername = await User.findOne({ username });
        if (existingUserWithUsername && existingUserWithUsername._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: "Username is already taken" });
        }
        updateData.username = username;
      }

      if (phoneNumber) {
        const phoneRegex = /^([+][1-9][0-9]{1,3})?[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({
            message: "Invalid phone number format. Must be 10 digits or include a valid country code.",
          });
        }
        updateData.phone = phoneNumber;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        updateData.email = email;
      }

      updatedAccountData = true;
    }

    if (req.file) {
      updateData.profilePhoto = `/uploads/profile_photos/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let message = "Profile updated successfully";
    if (updatedPassword) {
      message = "Password updated successfully";
    } else if (updatedAccountData) {
      message = "Profile updated successfully";
    }

    res.json({ message, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};


  const deleteUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
     
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
  
  
      const user = await User.findByIdAndDelete(id);
  
    
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  };
  
  const updateartistdetails = async (req, res) => {
    try {
      let artist = await Artist.findOneAndUpdate(
        { userId: req.params.userId },
        req.body,
        { new: true, upsert: true }
      );
      res.json(artist);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

  const getartistdetails = async (req, res) => {
    try {
        const artist = await Artist.findOne({ userId: req.params.userId });
        if (!artist) return res.status(404).json({ message: 'Artist not found' });
        res.json(artist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



const updateSocialLinks = async (req, res) => {
  try {
    const { instagram, facebook, youtube, linkdin } = req.body;
    const { userId } = req.params;

    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { instagram, facebook, youtube, linkdin },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



const updateBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountHolderName, bankName, accountNumber, ifscCode, upiId } = req.body;

    const bankDetails = await BankDetails.findOneAndUpdate(
      { userId },
      { accountHolderName, bankName, accountNumber, ifscCode, upiId },
      { new: true, upsert: true, runValidators: true } 
    );

    res.json({ message: 'Bank details updated successfully', bankDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bank details', error: error.message });
  }
};

const getBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const bankDetails = await BankDetails.findOne({ userId });

    if (!bankDetails) {
      return res.status(404).json({ message: "Bank details not found" });
    }

    res.status(200).json({ bankDetails });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bank details", error: error.message });
  }
};

const updateartwork = async (req, res) => {
  try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID' });
      }

      if (!req.body.minArtworkPrice) {
          return res.status(400).json({ message: 'Minimum Artwork Price is required.' });
      }

   
      if (req.body.sampleArtwork && !/^data:image\/([a-zA-Z]+);base64,/.test(req.body.sampleArtwork)) {
          return res.status(400).json({ message: 'Invalid image format. Use Base64 encoding.' });
      }

      let updatedArtwork = await Artwork.findOneAndUpdate(
          { userId },
          req.body,
          { new: true, runValidators: true }
      );

   
      if (!updatedArtwork) {
          updatedArtwork = new Artwork({ userId, ...req.body });
          await updatedArtwork.save();
          return res.status(201).json({ message: 'Artwork updated successfully', updatedArtwork });
      }

      res.status(200).json({ message: 'Artwork updated successfully', updatedArtwork });
  } catch (error) {
      res.status(500).json({ message: 'Error updating artwork', error: error.message });
  }
};



const getartwork= async (req, res) => {
  try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID' });
      }
      const artwork = await Artwork.findOne({ userId });
      if (!artwork) {
          return res.status(404).json({ message: 'Artwork not found' });
      }
      res.status(200).json({ artwork });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching artwork', error: error.message });
  }
};

const updategreements= async (req, res) => {
  try {
      const { userId } = req.params;
      const { agreements } = req.body; 

      if (!Array.isArray(agreements)) {
          return res.status(400).json({ message: 'Agreements must be an array' });
      }

      const user = await User.findByIdAndUpdate(
          userId,
          { agreements },
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Agreement details updated successfully', user });
  } catch (error) {
      console.error('Error updating agreement details:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const getagreements= async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ agreements: user.agreements || [] });
  } catch (error) {
      console.error('Error fetching agreement details:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const updateverification=async (req, res) => {
  try {
    const { userId } = req.params;
    const { verificationType, docNumber } = req.body;
    const documentFile = req.file ? req.file.path : null;

    if (!verificationType || !docNumber || !documentFile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          verification: { documentType: verificationType, documentNumber: docNumber, documentFile },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Verification details updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getverification= async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, "verification");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ verification: user.verification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatebuyerPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferredArtCategories, subscribeNewsletters, smsEmailAlerts } = req.body.preferences;

    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      {
        $set: {
          preferredArtCategories: preferredArtCategories.map(id => new mongoose.Types.ObjectId(id)),
          subscribeNewsletters,
          smsEmailAlerts
        }
      },
      { new: true, upsert: true }
    );

    console.log("Updated preferences:", preferences);

    if (!preferences) {
      return res.status(400).json({ success: false, message: "Failed to update preferences" });
    }

    res.status(200).json({ success: true, message: "Preferences updated successfully", data: preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const getbuyerPreferences = async (req, res) => {
  try {
      const { userId } = req.params;
      const preferences = await UserPreferences.findOne({ userId }).populate("preferredArtCategories");

      if (!preferences) {
          return res.status(404).json({ success: false, message: "Preferences not found" });
      }

      res.status(200).json({ success: true, data: preferences });
  } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updatebuisnessprodfile = async (req, res) => {
  try {
      const { userId } = req.params;
      const { businessName, businessDescription, website } = req.body;

      let businessProfile = await BusinessProfile.findOne({ userId });
      if (!businessProfile) {
          businessProfile = new BusinessProfile({ userId, businessName, businessDescription, website });
      } else {
          businessProfile.businessName = businessName;
          businessProfile.businessDescription = businessDescription;
          businessProfile.website = website;
      }

      await businessProfile.save();
      await User.findByIdAndUpdate(userId, { businessProfile: businessProfile._id });
      res.status(200).json({ message: 'Business profile updated successfully', businessProfile });
  } catch (error) {
      res.status(500).json({ message: 'Error updating business profile', error });
  }
};

const getbusinessprofile= async (req, res) => {
  try {
      const { userId } = req.params;
      const businessProfile = await BusinessProfile.findOne({ userId });
      if (!businessProfile) {
          return res.status(404).json({ message: 'Business profile not found' });
      }
      res.status(200).json(businessProfile);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching business profile', error });
  }
};

const updatesellartwork = async (req, res) => {
  try {
      const updatedArtwork = await SellIDetailsAndArtwork.findOneAndUpdate(
          { userId: req.params.userId },
          { $set: req.body },
          { new: true, upsert: true }
      );
      res.json({ message: 'Artwork details updated successfully', updatedArtwork });
  } catch (error) {
      res.status(500).json({ message: 'Error updating artwork details', error });
  }
};

const getsellartwork = async (req, res) => {
  try {
      const artwork = await SellIDetailsAndArtwork.findOne({ userId: req.params.userId });
      if (!artwork) {
          return res.status(404).json({ message: 'Artwork details not found' });
      }
      res.json({ artwork });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching artwork details', error });
  }
};



const updateTaxLegalCompliance = async (req, res) => {
  try {
    const existingCompliance = await TaxLegalCompliance.findOne({ userId: req.params.userId });

    const updatedData = { ...req.body, documents: existingCompliance?.documents || {} };

    Object.keys(req.files || {}).forEach(key => {
      updatedData.documents[key] = `/uploads/Verification/${req.files[key][0].filename}`;
    });

    const updatedCompliance = await TaxLegalCompliance.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updatedData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Tax legal compliance details updated successfully', updatedCompliance });

  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});

      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: 'Error updating tax legal compliance details', error: error.message });
  }
};




const getTaxLegalCompliance = async (req, res) => {
  try {
      const compliance = await TaxLegalCompliance.findOne({ userId: req.params.userId });
      if (!compliance) {
          return res.status(404).json({ message: 'Tax legal compliance details not found' });
      }
      res.json({ compliance });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching tax legal compliance details', error: error.message });
  }
};

const updatestatus=async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






module.exports = { getUserById,
  updateuserprofile,
  deleteUserById,
  updateartistdetails,
  getartistdetails,
  updateSocialLinks,
  updateBankDetails,
  getBankDetails,
  updateartwork,
  getartwork,
  updategreements,
  getagreements,
  updateverification,
  getverification,
  updatebuyerPreferences,
  getbuyerPreferences,
  updatebuisnessprodfile,
  getbusinessprofile,
  updatesellartwork,
  getsellartwork,
  updateTaxLegalCompliance, 
  getTaxLegalCompliance,
  updatestatus
};
