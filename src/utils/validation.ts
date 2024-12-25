export const validateMobileNumber = (mobileNumber: string): boolean => {
    const mobileRegex = /^\+91\d{10}$/; // Starts with +91 and followed by exactly 10 digits
    return mobileRegex.test(mobileNumber);
};
export const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50; // Length should be between 2 and 50 characters
};
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
};