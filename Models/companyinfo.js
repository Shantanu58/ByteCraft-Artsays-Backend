const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
       userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "User ID is required."]
        },
    companyName: {
        type: String,
        required: [true, "Company Name is required."],
    },
    companyType: {
        type: String,
        required: [true, "Company Type is required."],
    },
    gstin: {
        type: String,
        required: [true, "GSTIN is required."],
        validate: {
            validator: function (value) {
                return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(value);
            },
            message: "Invalid GSTIN format. It should be in the format: 99AAAAA9999A1Z5."
        }
    },
    pan: {
        type: String,
        required: [true, "PAN is required."],
        validate: {
            validator: function (value) {
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
            },
            message: "Invalid PAN format. It should be in the format: AAAAA9999A."
        }
    },
    tan: {
        type: String,
        required: [true, "TAN is required."],
        validate: {
            validator: function (value) {
                return /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value);
            },
            message: "Invalid TAN format. It should be in the format: AAAA99999A (4 letters, 5 digits, 1 letter)."
        }
    },
    cin: {
        type: String,
        required: [true, "CIN is required."],
        validate: {
            validator: function (value) {
                return /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value);
            },
            message: "Invalid CIN format. It should in the format: L12345MH2024PLC123456."
        }
    },
    address: {
        type: String,
        required: [true, "Address is required."],
    },
    landmark: {
        type: String,
    },
    city: {
        type: String,
        required: [true, "City is required."],
    },
    state: {
        type: String,
        required: [true, "State is required."],
    },
    country: {
        type: String,
        required: [true, "Country is required."],
    },
    pin: {
        type: String,
        required: [true, "PIN is required."],
    },
    contactNo: {
        type: String,
        required: [true, "Contact Number is required."],
    },
    emailAddress: {
        type: String,
        required: [true, "Email Address is required."],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."]
    }
}, { timestamps: true });

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;