"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validateName = exports.validateMobileNumber = void 0;
const validateMobileNumber = (mobileNumber) => {
    const mobileRegex = /^\+91\d{10}$/; // Starts with +91 and followed by exactly 10 digits
    return mobileRegex.test(mobileNumber);
};
exports.validateMobileNumber = validateMobileNumber;
const validateName = (name) => {
    if (!name) {
        return false; // Invalid if name is undefined, null, or an empty string
    }
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50; // Length should be between 2 and 50 characters
};
exports.validateName = validateName;
const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
