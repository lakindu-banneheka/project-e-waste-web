export interface Base_OTPProps {
    email: string;
    otp: string;
    is_used?: boolean;
}

export interface OTPProps extends Base_OTPProps {
    _id: string;
}