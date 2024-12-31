export var ServiceProviderStatus;
(function (ServiceProviderStatus) {
    ServiceProviderStatus["PENDING"] = "pending";
    ServiceProviderStatus["OTP_VERIFIED"] = "otp_verified";
    ServiceProviderStatus["EMAIL_VERIFIED"] = "email_verified";
    ServiceProviderStatus["BUSINESS_DETAILS_REMAINING"] = "business_details_remaining";
    ServiceProviderStatus["COMPLETED"] = "completed";
    ServiceProviderStatus["VERIFIED"] = "verified";
    ServiceProviderStatus["REJECTED"] = "rejected";
})(ServiceProviderStatus || (ServiceProviderStatus = {}));
