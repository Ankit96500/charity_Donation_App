import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();



export async function mailProtocolMiddelware(sender,text_){
    // congigure SMTP:

    const transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST || "notexist",
        port:process.env.SMTP_PORT || "notexist",
        secure:false,
        auth:{
            user:process.env.SMTP_USER || "notexist",
            pass:process.env.SMTP_PASS || "notexist",
        }
    })

    const mailOption = {
        from : process.env.SMTP_USER,
        to: sender,
        subject : "for Test:",
        text_show : 'This Mail rom The Salon Book Appointment:',
        html: `<p> ${text_}:</p>`,
    }
    try {
        const result = await transporter.sendMail(mailOption)
        return result;
    } catch (error) {
        return error;
    }
} 







