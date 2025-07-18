'use server';

import startDb from '@/lib/db';
import OTPModel from '@/models/OTPModel';
import { otpGen } from 'otp-gen-agent';
import nodemailer from 'nodemailer';
import { Base_OTPProps } from '@/types/OTP';

interface OTPMailProps {
  email: string;
  subject?: string;
  text?: string;
  html?: string;
}

export const sendOTPMail = async ({
  email,
  subject = 'Your Verification Code',
  text,
  html,
}: OTPMailProps): Promise<void> => {
  if (!email) {
    throw new Error('Email address is required.');
  }

  // Generate OTP
  const otp = await otpGen();

  // Default HTML body
  const htmlBody = html || getHtmlBody(otp);

  try {
    // Ensure database connection
    await startDb();

    // Save OTP to the database
    // await OTPModel.create({ email, otp, is_used:false });

    // Check environment variables
    const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = process.env;
    if (!NODEMAILER_EMAIL || !NODEMAILER_PASSWORD) {
      throw new Error('Missing email credentials in environment variables.');
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: NODEMAILER_EMAIL,
      to: email,
      subject,
      text: text || 'Please verify your email address using the OTP provided.',
      html: htmlBody,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log success response
    console.log(`Email sent successfully: ${info.response}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email. Please try again later.');
  }
};


const getHtmlBody = ({otp}:{otp: string}) => {

    return (`<!DOCTYPE html>
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP</title>
                <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
            </head>

            <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
            <table role="presentation"
                style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
                <tbody>
                <tr>
                    <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                    <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                        <tbody>
                        <tr>
                            <td style="padding: 20px 0px 0px;">
                            <div style="text-align: center; background-color: rgb(255, 255, 255); padding-top: 10px; display: flex; justify-content: center;">
                                <div style="padding-bottom: 20px; display: flex; justify-content: center; "><img src="https://science.kln.ac.lk/units/edaic/images/2023/03/03/logo-extended-black.png" alt="project-e-waste-logo" style="width: 200px;"></div>
                            </div>
                            <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                <div style="color: rgb(0, 0, 0); text-align: center;">
                                <h1 style="margin: 1rem 0">Verification code</h1>
                                <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                                <p style="padding-bottom: 16px;"><strong style="font-size: 200%;letter-spacing: 5px; ">${otp}</strong></p>
                        <p style="padding-bottom: 16px">Please verify you're really you by entering this 6-digit code when you sign in. Just a heads up, this code will expire in 20 minutes for security reasons.</p>
                                <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                                </div>
                            </div>
                            <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                                <p style="padding-bottom: 16px">Project E-Waste | University Of Kelaniya</p>
                            </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </td>
                </tr>
                </tbody>
            </table>
            </body>

        </html>
    `)
}


// Verify Email 
// export const verifyEmail = async ({
//     email,
//     otp
// }: Base_OTPProps) => {

//     try {
//         await startDb();
//         const otp_data = await OTPModel.findOne({email: email});
//         console.log(otp_data);
    
//         if(otp_data && otp_data.otp === otp){
//             await OTPModel.findOneAndUpdate({email: email}, {...otp_data, is_verified: true});
//             return true;
//         } else {
//             throw new Error("Invalid OTP."); 
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

export const verifyEmail = async ({ email, otp }: Base_OTPProps) => {
    try {
        await startDb();
        
        const otpData = await OTPModel.findOne({ email: 'lakindu2001l@gmail.com' });
        console.log(otpData);
        if (!otpData) {
            return new Error("Invalid OTP. test");
        }

        if (otpData.is_used) {
            return new Error("OTP has already been used.");
        }

        console.log(otpData.otp, otp);
        if (otpData.otp !== otp) {
            return new Error("Invalid OTP.");
        }
        
        otpData.is_used = true;
        const result = await otpData.save();
        
        return result ? true : false;  // Return true if save is successful, otherwise false
    } catch (error) {
        console.error("Error verifying email:", error);
        return false;
    }
}