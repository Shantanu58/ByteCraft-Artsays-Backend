const mongoose = require('mongoose');

const taxLegalComplianceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required."]
    },
    gstNumber: {
        type: String,
        required: [true, "GSTIN is required."],
        validate: {
            validator: function (value) {
                return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(value);
            },
            message: "GSTIN must be in the format 99AAAAA9999A1Z5."
        }
    },
    panNumber: {
        type: String,
        required: [true, "PAN is required."],
        validate: {
            validator: function (value) {
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
            },
            message: "PAN must be in the format AAAAA9999A."
        }
    },
    tanNumber: {
        type: String,
        required: [true, "TAN is required."],
        validate: {
            validator: function (value) {
                return /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value);
            },
            message: "TAN must be in the format AAAA99999A (4 letters, 5 digits, 1 letter)."
        }
    },
    cinNumber: {
        type: String,
        required: [true, "CIN is required."],
        validate: {
            validator: function (value) {
                return /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value);
            },
            message: "CIN must be a 21-character alphanumeric string in the format L12345MH2024PLC123456."
        }
    },
    aadhaarNumber: {
        type: String,
        required: [true, "Aadhaar number is required."],
        validate: {
            validator: function (value) {
                return /^\d{12}$/.test(value);
            },
            message: "Aadhaar number must be a 12-digit numeric value."
        }
    },
    businessCertNumber: {
        type: String,
        required: false
    },
    documents: {
        gst: { type: String, required: [true, "GST document is required."] },
        pan: { type: String, required: [true, "PAN document is required."] },
        tan: { type: String, required: [true, "TAN document is required."] },
        cin: { type: String, required: [true, "CIN document is required."] },
        aadhaar: { type: String, required: [true, "Aadhaar document is required."] },
        businessCert: { type: String, required: false } 
    }
}, { timestamps: true });

module.exports = mongoose.model('TaxLegalCompliance', taxLegalComplianceSchema);
