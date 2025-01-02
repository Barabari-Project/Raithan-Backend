export interface IServiceSeeker {
    _id: string;
    status: ServiceSeekerStatus;
    mobileNumber: string;
}

export enum ServiceSeekerStatus{
    PENDING = "pending",
    VERIFIED = "verified"
}