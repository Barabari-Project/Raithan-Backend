"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderStatus = void 0;
var ServiceProviderStatus;
(function (ServiceProviderStatus) {
    ServiceProviderStatus["PENDING"] = "pending";
    ServiceProviderStatus["OTP_VERIFIED"] = "otp_verified";
    ServiceProviderStatus["EMAIL_VERIFIED"] = "email_verified";
    ServiceProviderStatus["BUSINESS_DETAILS_REMAINING"] = "business_details_remaining";
    ServiceProviderStatus["COMPLETED"] = "completed";
    ServiceProviderStatus["VERIFIED"] = "verified";
    ServiceProviderStatus["REJECTED"] = "rejected";
})(ServiceProviderStatus || (exports.ServiceProviderStatus = ServiceProviderStatus = {}));
