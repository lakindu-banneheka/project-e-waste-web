// 'use server'
// import nodemailer from 'nodemailer';

// interface EmailProps {
//     html: string;
//     to: string;
// }

// export const sendMail = async ({
//     html,
//     to
// }: EmailProps) => {

//     console.log('mail 1')
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         // host: '',
//         // port: 456,
//         secure: true,
//         auth: {
//           user: process.env.NODEMAILER_EMAIL,
//           pass: process.env.NODEMAILER_PASSWORD
//         }
//     });

//       console.log('mail 2')

//     const mailOptions = {
//         from: process.env.NODEMAILER_EMAIL,
//         to: to,
//         subject: 'Sending Email using Node.js',
//         text: 'That was easy!',
//         html: html
//     };
//     console.log('mail 3')

//     await transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(info.response);
//         }
//     });
//     console.log('mail 4')

// }