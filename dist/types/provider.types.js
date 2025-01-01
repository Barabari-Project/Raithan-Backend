"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.ServiceProviderStatus = void 0;
var ServiceProviderStatus;
(function (ServiceProviderStatus) {
    ServiceProviderStatus["PENDING"] = "pending";
    ServiceProviderStatus["OTP_VERIFIED"] = "otp_verified";
    ServiceProviderStatus["BUSINESS_DETAILS_REMAINING"] = "business_details_remaining";
    ServiceProviderStatus["VERIFICATION_REQUIRED"] = "verification_required";
    ServiceProviderStatus["VERIFIED"] = "verified";
    ServiceProviderStatus["REJECTED"] = "rejected";
    ServiceProviderStatus["MODIFICATION_REQUIRED"] = "modification_required";
    ServiceProviderStatus["RE_VERIFICATION_REQUIRED"] = "re_verification_required";
})(ServiceProviderStatus || (exports.ServiceProviderStatus = ServiceProviderStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "Male";
    Gender["FEMALE"] = "Female";
    Gender["OTHER"] = "Other";
})(Gender || (exports.Gender = Gender = {}));
