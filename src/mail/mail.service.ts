import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // Peut être remplacé par SMTP, Outlook...
    auth: {
      user: process.env.EMAIL_USER, // Stocke l'e-mail dans `.env`
      pass: process.env.EMAIL_PASS, // Stocke le mot de passe dans `.env`
    },
  });

  async sendOrderConfirmation(email: string, orderDetails: any) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation de commande',
      text: `Votre commande ${orderDetails.id} a été validée !`,
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`📩 Email envoyé à ${email}`);
  }
}