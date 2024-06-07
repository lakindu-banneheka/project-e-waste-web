import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';

interface SendEmailsReqProps {
    req: NextRequest;
}

export async function POST({req}: SendEmailsReqProps) {
    const { subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: '',
        // port: 456,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD
        }
      });


      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: 'lakindu2001l@ygmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html:  `<h1>
        test
        </h1>`
      };

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return NextResponse.json(error);
        } else {
            return NextResponse.json("Email sent");
        }
    });

}