import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import { Twilio } from 'twilio';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID as string;

if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error('Missing Twilio configuration in environment variables');
}

const client = new Twilio(accountSid, authToken);

/**
 * Send OTP to the provided phone number using Twilio Verify Service.
 * @param toPhoneNumber - The recipient's phone number (E.164 format)
 * @returns Promise with the verification SID
 */
export const sendOTP = async (toPhoneNumber: string): Promise<string> => {
    // return "";
    const verification = await client.verify.v2.services(verifyServiceSid)
        .verifications.create({ to: toPhoneNumber, channel: 'sms' });
    return verification.sid;
};

/**
 * Verify the OTP for a phone number.
 * @param toPhoneNumber - The recipient's phone number (E.164 format)
 * @param code - The OTP provided by the user
 * @returns Promise indicating if the OTP is verified
 */
export const verifyOTP = async (toPhoneNumber: string, code: string): Promise<void> => {
    // if (code == '123123') {
    //     return;
    // } else {
    //     throw createHttpError(400, 'OTP verification failed');
    // }
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
        .verificationChecks.create({ to: toPhoneNumber, code });

    if (verificationCheck.status !== 'approved') {
        throw createHttpError(400, 'OTP verification failed');
    }

};
