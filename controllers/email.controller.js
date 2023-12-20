import nodemailer from 'nodemailer';
import emailModel from '../models/email.model.js';

const sendMessage = async(req, res) => {

    const {name, email, phone, message} = req.body;

    try{
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth:{
                user: process.env.USER_MESSAGE,
                pass: process.env.PASS_MESSAGE,
            },
        });

        let info = await transporter.sendMail({
            from:email,
            to: process.env.EMAIL_MESSAGE_TO,
            subject: `A new enquiry message from ${name}`,
            text: message,
        });

        const newMessage = new emailModel({
            name,
            email,
            phone,
            message,
            messageId:info.messageId,
        });

        await newMessage.save();

        res.status(200).json({
            message:"Enquiry message was sent successfully"
        });
    } catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"});
    }
}

export {sendMessage};