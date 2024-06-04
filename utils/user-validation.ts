import { UserRole } from '@/types/User';
import { z } from 'zod';

// university id
const validPrefixes = ["EC", "PS", "PE"];
const validYears = ["2019", "2020", "2021", "2022"];

function createRegex(prefixes: string[], years: string[]): RegExp {
    const prefixPattern = prefixes.join("|");
    const yearPattern = years.join("|");
    return new RegExp(`^(${prefixPattern})\/(${yearPattern})\/\\d{3}$`);
}

export const universityIdSchema = z.string().regex(createRegex(validPrefixes, validYears), {
    message: "Invalid university ID format. Expected format: XX/YYYY/XXX",
});


// Define the regex pattern for Sri Lankan phone numbers
const sriLankanPhoneNumberRegex = /^(?:0(?:7[01245678]\d{7}|[1-9]\d{8}))$/;

export const phoneNumberSchema = z.string().regex(sriLankanPhoneNumberRegex, {
    message: "Invalid phone number format. Expected format: 07x xxx xxxx or 0xx xxx xxxx",
});


// User role validation 
export const userRoleSchema = z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return {message: 'Please select your user type'};
    },
})

// Define the regex pattern for a University of Kelaniya email address
const universityEmailRegex = /^[\w-]+@(?:stu\.kln\.ac\.lk)$/;

export const universityEmailSchema = z.string().regex(universityEmailRegex, {
    message: "Invalid University of Kelaniya email address format. Expected format: example@stu.kln.ac.lk",
});


// Define the regex pattern for a strong password
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const passwordSchema = z.string().regex(strongPasswordRegex, {
    message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.",
});

export const firstNameSchema =  z.string().min(3, "First name must be at least 3 characters long.");
export const lastNameSchema =  z.string().min(3, "Last name must be at least 3 characters long.");
export const userNameSchema =  z.string().min(3, "User name must be at least 3 characters long.");