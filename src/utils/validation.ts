export const validateMobileNumber = (mobileNumber: string): boolean => {
    const mobileNumberRegex = /^[0-9]{10}$/; // Simple validation for a 10-digit number
    return mobileNumberRegex.test(mobileNumber);
};
export const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50; // Length should be between 2 and 50 characters
};